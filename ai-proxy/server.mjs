/**
 * SAHMstr AI proxy — the "vault pattern" for photo tagging.
 *
 * A tiny server that holds the vision API key on the VPS (in .env, never in the
 * browser) and forwards a single kind of request to an OpenAI-compatible vision
 * provider (xAI/Grok by default). The SAHMstr browser app calls THIS server at
 * `/api/ai/tag` on its own domain; the key never leaves the VPS.
 *
 * This mirrors how the vault app holds its DeepSeek key server-side, and it is
 * the secure alternative to the browser-stored BYOK key (see ADR-016 / ADR-017).
 *
 * It is deliberately dependency-free: Node 18+ has `fetch` and an HTTP server
 * built in, so there is nothing to `npm install`. Run it with plain `node`.
 *
 * Env (see .env.example):
 *   OPENAI_BASE_URL   e.g. https://api.x.ai/v1
 *   OPENAI_API_KEY    the provider key (secret)
 *   VISION_MODEL      e.g. grok-2-vision-1212
 *   PORT              internal port to listen on (default 8090)
 *   ALLOW_ORIGIN      optional CORS origin (default same-origin; usually unset
 *                     because Caddy/nginx serves the app and proxy same-origin)
 */

import { createServer } from 'node:http';

const {
  OPENAI_BASE_URL = 'https://api.x.ai/v1',
  OPENAI_API_KEY,
  VISION_MODEL = 'grok-2-vision-1212',
  PORT = '8090',
  ALLOW_ORIGIN = '',
} = process.env;

if (!OPENAI_API_KEY) {
  console.error('FATAL: OPENAI_API_KEY is not set. Put it in .env.');
  process.exit(1);
}

/** Read a request body up to a sane cap (image URLs are small; data URLs less so). */
function readBody(req, limitBytes = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limitBytes) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  };
  if (ALLOW_ORIGIN) {
    headers['Access-Control-Allow-Origin'] = ALLOW_ORIGIN;
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  }
  res.writeHead(status, headers);
  res.end(body);
}

const server = createServer(async (req, res) => {
  // CORS preflight (only relevant if ALLOW_ORIGIN is set for cross-origin dev).
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  // Health check — handy for `curl` and for confirming the service is up.
  if (req.method === 'GET' && req.url === '/api/ai/health') {
    sendJson(res, 200, { ok: true, model: VISION_MODEL });
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/ai/tag') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  const imageUrl = typeof payload.imageUrl === 'string' ? payload.imageUrl : '';
  const instruction = typeof payload.instruction === 'string' ? payload.instruction : '';
  if (!imageUrl || !instruction) {
    sendJson(res, 400, { error: 'imageUrl and instruction are required' });
    return;
  }

  // Forward to the vision provider, key attached server-side.
  const upstream = `${OPENAI_BASE_URL.replace(/\/$/, '')}/chat/completions`;
  const body = {
    model: VISION_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: instruction },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
    temperature: 0.2,
    max_tokens: 700,
  };

  try {
    const r = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      let detail = '';
      try {
        const err = await r.json();
        detail = err?.error?.message ?? JSON.stringify(err);
      } catch {
        detail = await r.text().catch(() => '');
      }
      // Log the real upstream error server-side; return a clean message.
      console.error(`Upstream ${r.status}: ${detail}`);
      sendJson(res, 502, {
        error: `The AI provider returned ${r.status}. ${detail || 'Check the model name and key.'}`,
      });
      return;
    }

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) {
      sendJson(res, 502, { error: 'The AI returned an empty response.' });
      return;
    }
    sendJson(res, 200, { text });
  } catch (err) {
    console.error('Proxy error:', err);
    sendJson(res, 500, { error: 'The AI request failed on the server.' });
  }
});

server.listen(Number(PORT), '127.0.0.1', () => {
  console.log(`SAHMstr AI proxy listening on 127.0.0.1:${PORT} → ${OPENAI_BASE_URL} (${VISION_MODEL})`);
});
