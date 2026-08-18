/**
 * Bring-your-own-key (BYOK) vision AI.
 *
 * This is the pragmatic sibling of the sovereign contextVM path (ADR-013): a
 * simple mode where the owner pastes an API key for any OpenAI-compatible vision
 * provider, and the wardrobe/pantry call it directly to tag a photo.
 *
 * Trade-off, stated plainly: the key lives in the *browser's localStorage* on
 * the device that entered it — it is never in the bundle, never in git, never
 * sent anywhere except directly to the chosen provider. That is fine for a
 * personal / demo setup, but it is NOT the model to hand to end users (a shared
 * client can't keep a secret). For a public, multi-user deployment, the
 * contextVM server (docs/CONTEXTVM.md) remains the right answer. See ADR-016.
 *
 * Every provider here speaks the OpenAI `/chat/completions` API with image
 * input, so one code path covers all of them — you only swap a base URL, a key,
 * and a model name.
 */

/** A provider preset — a base URL and a sensible default vision model. */
export interface VisionProviderPreset {
  id: string;
  label: string;
  baseUrl: string;
  defaultModel: string;
  /** A short human note shown under the picker. */
  note: string;
  /** Where to get a key. */
  keyUrl?: string;
}

export const VISION_PRESETS: VisionProviderPreset[] = [
  {
    id: 'server',
    label: 'Your server (recommended)',
    // A same-origin path served by the AI proxy on the VPS (ai-proxy/server.mjs,
    // fronted by Caddy/nginx). The key lives on the server, never in the browser.
    baseUrl: '/api/ai',
    defaultModel: 'server',
    note: 'Calls your own server, which holds the key safely on the VPS. No key is stored in this browser. This is the vault-style setup — set it up with docs/AI_PROXY.md.',
  },
  {
    id: 'xai',
    label: 'xAI (Grok) — key in this browser',
    baseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-2-vision-1212',
    note: 'Calls xAI directly with a key stored in THIS browser. Simplest, but the key lives on your device. Fine for personal use.',
    keyUrl: 'https://console.x.ai',
  },
  {
    id: 'routstr',
    label: 'Routstr (sats-native)',
    baseUrl: 'https://api.routstr.com/v1',
    defaultModel: 'gpt-4o-mini',
    note: 'Nostr-native, pay-per-request in Cashu/Lightning. Paste a session key (sk-…) or a Cashu token as the key.',
    keyUrl: 'https://routstr.com',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4o-mini',
    note: 'One key, many vision models. Pay-as-you-go.',
    keyUrl: 'https://openrouter.ai/keys',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    note: 'Direct OpenAI. gpt-4o-mini has good, cheap vision.',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'custom',
    label: 'Custom (OpenAI-compatible)',
    baseUrl: '',
    defaultModel: '',
    note: 'Any other OpenAI-compatible endpoint. Enter its base URL and model.',
  },
];

export function getPreset(id: string): VisionProviderPreset {
  return VISION_PRESETS.find((p) => p.id === id) ?? VISION_PRESETS[0];
}

/** The saved BYOK settings. */
export interface VisionConfig {
  providerId: string;
  /** Base URL (…/v1). Filled from the preset unless provider is "custom". */
  baseUrl: string;
  model: string;
  apiKey: string;
}

const STORAGE_KEY = 'sahmstr:ai-vision:v1';

/** Read the saved config, tolerating absent/corrupt storage (ADR-006 spirit). */
export function loadVisionConfig(): VisionConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VisionConfig>;
    if (
      typeof parsed.providerId === 'string' &&
      typeof parsed.baseUrl === 'string' &&
      typeof parsed.model === 'string' &&
      typeof parsed.apiKey === 'string'
    ) {
      return parsed as VisionConfig;
    }
    return null;
  } catch {
    return null;
  }
}

/** Persist the config. Best-effort — a full/blocked store must not throw. */
export function saveVisionConfig(config: VisionConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Private browsing / quota: the setting simply won't persist. No crash.
  }
}

export function clearVisionConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Does this config use the server-side proxy (no browser key)? */
export function isServerProxy(config: VisionConfig | null): boolean {
  return config?.providerId === 'server';
}

/** Is there a usable config? The server proxy needs no key; others need one. */
export function isVisionConfigured(config: VisionConfig | null): boolean {
  if (!config) return false;
  if (isServerProxy(config)) return true; // key lives on the server
  return Boolean(config.apiKey && config.baseUrl && config.model);
}

/**
 * Run one vision completion against an OpenAI-compatible endpoint.
 *
 * The image is passed as a URL (the Blossom URL of the uploaded photo). The
 * model is asked to return the tagging JSON the caller's prompt specifies; we
 * return the raw assistant text for the caller to parse.
 */
export async function visionComplete(args: {
  config: VisionConfig;
  imageUrl: string;
  instruction: string;
  signal?: AbortSignal;
}): Promise<string> {
  const { config, imageUrl, instruction, signal } = args;

  // Server-proxy path: POST to our own /api/ai/tag; the VPS holds the key and
  // returns { text }. No key or provider details are sent from the browser.
  if (isServerProxy(config)) {
    const base = config.baseUrl.replace(/\/$/, '') || '/api/ai';
    const response = await fetch(`${base}/tag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, instruction }),
      signal,
    });
    if (!response.ok) {
      let detail = '';
      try {
        const err = await response.json();
        detail = typeof err?.error === 'string' ? err.error : JSON.stringify(err);
      } catch {
        detail = await response.text().catch(() => '');
      }
      throw new Error(detail || `The AI server returned ${response.status}.`);
    }
    const data = await response.json();
    const text: unknown = data?.text;
    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('The AI server returned an empty response.');
    }
    return text;
  }

  const url = `${config.baseUrl.replace(/\/$/, '')}/chat/completions`;

  const body = {
    model: config.model,
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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let detail = '';
    try {
      const err = await response.json();
      detail = err?.error?.message ?? JSON.stringify(err);
    } catch {
      detail = await response.text().catch(() => '');
    }
    throw new Error(
      `The AI provider returned ${response.status}. ${detail || 'Check your key, model name, and that the model supports images.'}`,
    );
  }

  const data = await response.json();
  const text: unknown = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('The AI returned an empty response.');
  }
  return text;
}
