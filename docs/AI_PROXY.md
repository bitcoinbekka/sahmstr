# Running the SAHMstr AI proxy (the "vault pattern")

A step-by-step runbook for holding your vision AI key **on the VPS** — never in
the browser — the same way your vault app holds its DeepSeek key. One command at
a time, matching `docs/DEPLOY.md`.

**What you get:** a tiny server on your VPS that holds your xAI (or other
OpenAI-compatible) key in a `.env` file. The SAHMstr site calls *your* server at
`sahmstr.com/api/ai/tag`; your server calls xAI with the key and returns the
result. **The key never leaves the VPS** and is never in the site's code.

**How it differs from the browser key:** in Settings you can also paste a key
straight into the browser (simplest, but the key sits on your device). This
runbook is the secure alternative — pick **"Your server (recommended)"** in
Settings and follow the steps below. See ADR-016/ADR-017.

---

## The shape of it

```
  Browser (sahmstr.com)                  Your VPS
  ┌────────────────────┐                 ┌──────────────────────────────┐
  │ "Tag with AI"       │  POST /api/ai/  │  Caddy (torii-quest-web)      │
  │ sends { imageUrl,   │ ──── tag ─────► │   └─ /api/ai/* → nginx :8083  │
  │        instruction }│                 │        └─ proxy 127.0.0.1:8090│
  │                     │                 │             (holds the key)   │
  │ gets { text } back  │ ◄─────────────  │             └─ calls xAI      │
  └────────────────────┘                 └──────────────────────────────┘
```

The proxy listens on **127.0.0.1:8090** (internal only). nginx (already serving
`sahmstr.com` on 8083) forwards `/api/ai/` to it, so the browser talks to its own
origin — no CORS, no key on the client.

> Ports 8080/8081/8082/8083 are already used on this box. **8090** is free —
> confirm with `sudo ss -tlnp | grep 8090` (should print nothing).

---

## Before you start

- The site is deployed (`docs/DEPLOY.md`) and live at `https://sahmstr.com`.
- Node is installed (you already use it to build the site: `node -v`).
- You have an **xAI API key** from <https://console.x.ai> (or any other
  OpenAI-compatible vision provider's base URL + key + model).

---

## Step 1 — Get the proxy files (they ship in the repo)

They're in `~/sahmstr/ai-proxy/` after a normal `git pull`:

```bash
cd ~/sahmstr
git pull
ls ai-proxy
```

You should see `server.mjs` and `.env.example`.

---

## Step 2 — Put your key in a local .env (never committed)

```bash
cd ~/sahmstr/ai-proxy
cp .env.example .env
nano .env
```

Fill in your values (xAI shown):

```dotenv
OPENAI_BASE_URL=https://api.x.ai/v1
OPENAI_API_KEY=xai-...your real key...
VISION_MODEL=grok-4.6
API_STYLE=responses
PORT=8090
ALLOW_ORIGIN=
```

> **`API_STYLE`.** xAI's current models use their **Responses API**
> (`API_STYLE=responses`, the default). For OpenAI or OpenRouter instead, set
> `OPENAI_BASE_URL`/`VISION_MODEL` accordingly and use `API_STYLE=chat`.

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`), then lock it down:

```bash
chmod 600 .env
```

> `.env` is gitignored, so it can never be pushed to GitHub. The key lives only
> here, exactly like `/etc/vault-alerts.env` for your vault app.

---

## Step 3 — Test the proxy by hand once

Load the env and run it in the foreground to confirm it starts:

```bash
cd ~/sahmstr/ai-proxy
set -a; . ./.env; set +a
node server.mjs
```

You should see: `SAHMstr AI proxy listening on 127.0.0.1:8090 → https://api.x.ai/v1 (grok-4.6, style=responses)`.

In a **second terminal** (SSH in again), check health:

```bash
curl -s http://127.0.0.1:8090/api/ai/health
```

Expect `{"ok":true,"model":"grok-4.6","apiStyle":"responses"}`. Then stop the foreground
process with `Ctrl+C`.

---

## Step 4 — Keep it running with systemd (the vault way)

Create a service so it starts on boot and restarts if it crashes:

```bash
sudo tee /etc/systemd/system/sahmstr-ai.service > /dev/null <<EOF
[Unit]
Description=SAHMstr AI proxy
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/sahmstr/ai-proxy
EnvironmentFile=/home/ubuntu/sahmstr/ai-proxy/.env
ExecStart=/usr/bin/node /home/ubuntu/sahmstr/ai-proxy/server.mjs
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
```

> If `which node` prints something other than `/usr/bin/node`, put that path in
> the `ExecStart` line above.

Enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now sahmstr-ai
sudo systemctl status sahmstr-ai --no-pager
```

You want `active (running)`. Confirm health again:

```bash
curl -s http://127.0.0.1:8090/api/ai/health
```

---

## Step 5 — Route /api/ai/ to the proxy in nginx

nginx already serves `sahmstr.com` on 8083. Add a location so `/api/ai/` reaches
the proxy. Open the config:

```bash
sudo nano /etc/nginx/sites-available/sahmstr.com
```

Add this block **inside** the `server { ... }` block, above the `location / {`
line:

```nginx
    location /api/ai/ {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_read_timeout 120s;
    }
```

Save, then test and reload (must pass before reload):

```bash
sudo nginx -t
```

If it prints `test is successful`:

```bash
sudo systemctl reload nginx
```

---

## Step 6 — Verify end to end through the public URL

```bash
curl -s https://sahmstr.com/api/ai/health
```

Expect `{"ok":true,"model":"grok-4.6","apiStyle":"responses"}`. If you get that, the browser
can reach your key-holding server on its own origin.

---

## Step 7 — Turn it on in the app (Settings)

1. Open `https://sahmstr.com` → **Settings** → **Photo tagging AI**.
2. Provider: **Your server (recommended)**.
3. Click **Save**. (No key is entered here — that's the point.)
4. Go to **Wardrobe → Add Item**, upload a photo, tap **Tag with AI**.

The request goes to your server, your server calls xAI with the key, and the
fields fill in. Nothing sensitive ever touches the browser.

---

## Everyday operations

| Task | Command |
|------|---------|
| Status | `sudo systemctl status sahmstr-ai --no-pager` |
| Logs | `sudo journalctl -u sahmstr-ai -f` |
| Restart | `sudo systemctl restart sahmstr-ai` |
| Change key/model | edit `~/sahmstr/ai-proxy/.env`, then `sudo systemctl restart sahmstr-ai` (no site rebuild) |
| Stop | `sudo systemctl stop sahmstr-ai` |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/api/ai/health` 502 | proxy not running | `sudo systemctl status sahmstr-ai`; read `journalctl -u sahmstr-ai` |
| 404 at `/api/ai/health` | nginx location missing | re-check Step 5; `sudo nginx -t && sudo systemctl reload nginx` |
| "AI provider returned 404" | wrong `VISION_MODEL` | fix model in `.env`, `sudo systemctl restart sahmstr-ai` (no rebuild) |
| Port 8090 in use | something else took it | pick another free port in `.env` **and** the nginx `proxy_pass` |
| Key rejected (401) | bad `OPENAI_API_KEY` | fix in `.env`, restart the service |

---

## Security notes

- The key lives **only** in `~/sahmstr/ai-proxy/.env` (`chmod 600`), never in
  git, never in the browser, never in the site bundle. Same posture as vault.
- The proxy listens on `127.0.0.1` only — it is not reachable from the internet
  except through nginx/Caddy at `/api/ai/`.
- Set a **spending limit** on the xAI key at console.x.ai as a backstop.
- On a public site, anyone can hit `/api/ai/tag` and spend your key's budget. If
  that matters, add a simple shared-secret header or rate limit later — tell the
  agent and it can extend `server.mjs`.
