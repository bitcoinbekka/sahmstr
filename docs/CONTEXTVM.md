# Running the SAHMstr AI server (contextVM, paid in sats)

A step-by-step runbook for hosting the AI that powers photo tagging in the
wardrobe and pantry. Same one-command-at-a-time style as `docs/DEPLOY.md` and
`docs/RELAY.md`.

**What you get:** an AI service that lives on Nostr. When a mother taps
"Tag with AI" on a photo, the app sends the image to *your* server, your server
asks for a few sats, her wallet pays it, and the server reads the photo and
fills in the form. **The sats go to your wallet.** This is the revenue path.

**Why it's built this way:** the SAHMstr app holds no API key and runs no
backend of its own (see `docs/ADR.md`, ADR-001 and ADR-013). The AI is a
completely separate service — a *contextVM server* — that the app merely points
at. Swapping providers, or changing the price, never requires an app rebuild.

**The jargon, once, in plain terms:**

| Term | What it means here |
|------|--------------------|
| **contextVM** | A way to run an AI over Nostr. Client and server exchange messages inside `kind:25910` events. Nothing runs in the user's browser except the request. |
| **MCP** | The message format contextVM speaks ("tools/call"). You don't touch it — the library handles it. |
| **CEP-8** | The "please pay me" step. The server answers with a Lightning invoice; the app pays it before getting the result. |
| **The "brain"** | The actual vision model. contextVM points at any OpenAI-compatible vision endpoint. You choose a hosted one (cheapest to start) or self-host later. |

---

## The shape of what you're deploying

```
  SAHMstr app (browser)                Your VPS
  ┌───────────────────┐                ┌──────────────────────────────┐
  │ "Tag with AI"      │  kind:25910   │  contextVM server (Docker)     │
  │ encrypts request   │ ───────────►  │   ├─ speaks MCP over Nostr     │
  │                    │               │   ├─ asks for sats (CEP-8)     │
  │ pays invoice (NWC) │ ◄─ invoice ─  │   ├─ receives payment → wallet │
  │                    │               │   └─ calls the vision "brain"  │
  │ gets tags back     │ ◄── result ── │                                │
  └───────────────────┘               └───────────────┬────────────────┘
           ▲                                           │ HTTPS
           │ both talk over                            ▼
     wss://relay.sahmstr.com                  Vision model endpoint
     (your relay, already running)            (hosted, or self-hosted)
```

Three things must exist:

1. **A relay** the app and the server both use — you already have this:
   `wss://relay.sahmstr.com` (see `docs/RELAY.md`).
2. **A vision "brain"** — an OpenAI-compatible endpoint that can look at an image
   (Step 1 below). Start with a hosted one; self-host later if you want.
3. **The contextVM server** — the piece this runbook stands up (Steps 2–5).

You do everything over SSH on the VPS, as with the other runbooks.

---

## Before you start

- The relay from `docs/RELAY.md` should be up at `wss://relay.sahmstr.com`.
- You need a **Lightning wallet the server can receive to.** The simplest path
  is an LNbits instance or an Alby account that exposes an LNURL/lightning
  address the contextVM server can generate invoices from. Have its connection
  details ready (an LNbits URL + invoice/admin key, or an NWC connection string).
- Decide the "brain." Cheapest to start: a hosted open vision model behind an
  OpenAI-compatible API (e.g. a Qwen2.5-VL or Llama-Vision endpoint from an
  inference host). You'll need its **base URL, API key, and model name.**

> This runbook keeps the app side unchanged. The only app edit at the very end
> is pasting the server's public key into one config line (Step 7).

---

## Step 1 — Get a vision "brain" endpoint

You need three values from whichever inference host you pick:

- `OPENAI_BASE_URL` — e.g. `https://your-inference-host/v1`
- `OPENAI_API_KEY`  — the host's API key
- `VISION_MODEL`    — the model id, e.g. `qwen2.5-vl-7b-instruct`

Any provider that speaks the OpenAI **chat completions** API with image input
works. **This key lives only on your VPS** — it is never in the app bundle,
which is the whole point.

> Self-hosting the model later (e.g. Ollama or vLLM on a GPU box) just means
> pointing these three values at your own machine. Nothing else changes.

---

## Step 2 — Get the server's own Nostr identity

The contextVM server is itself a Nostr identity — a keypair. This is separate
from your personal npub.

Generate a fresh key. If you have `nak` installed on the VPS:

```bash
nak key generate
```

It prints a private key (`nsec…` / hex `sec`) and a public key (`npub…` / hex
`pub`).

- Keep the **private key** secret — it goes in the server's config only.
- Copy the **hex public key** (64 characters). You'll paste it into the app in
  Step 7 as `CONTEXTVM_PROVIDER.pubkey`.

> No `nak`? Any tool that generates a Nostr key works (e.g. <https://nostrtool.com>).
> You need the hex `pub` and the hex `sec`.

### Allowlist the server on your relay

The server publishes its replies to `wss://relay.sahmstr.com`, and your relay's
write policy is an allowlist (see `docs/RELAY.md`, Step 3). Add the server's hex
pubkey there:

```bash
cd ~/sahmstr/relay
nano write-policy.js      # add the server's hex pubkey to ALLOWLIST
docker compose restart
```

Requests *from users* are gift-wrapped/encrypted and don't need allowlisting;
the server's replies do, because they're published by the server key.

---

## Step 3 — Put the server files on the VPS

We run the contextVM server in Docker alongside the relay and the app. Create a
folder for it:

```bash
cd ~/sahmstr
mkdir -p contextvm
cd contextvm
```

Create the environment file that holds all secrets (this file is **secret** —
never commit it):

```bash
nano .env
```

Paste, filling in your values from Steps 1–2:

```dotenv
# --- The server's Nostr identity (Step 2) ---
NOSTR_PRIVATE_KEY=nsec1...your-server-secret...

# --- Where it listens (your relay from docs/RELAY.md) ---
RELAYS=wss://relay.sahmstr.com

# --- The MCP tool the app calls (must match the app; do not change) ---
TOOL_NAME=tag_image

# --- The vision "brain" (Step 1) ---
OPENAI_BASE_URL=https://your-inference-host/v1
OPENAI_API_KEY=sk-...your-inference-key...
VISION_MODEL=qwen2.5-vl-7b-instruct

# --- Pricing (sats). Keep near the app's shown estimate (~25). ---
PRICE_SATS=25

# --- Your receiving wallet (choose ONE style your image supports) ---
# LNbits style:
LNBITS_URL=https://your-lnbits-host
LNBITS_INVOICE_KEY=...invoice/admin key...
# ...or an NWC connection string, if your server image uses NWC to receive:
# NWC_URI=nostr+walletconnect://...
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

Lock the file down so only you can read the secrets:

```bash
chmod 600 .env
```

> **`TOOL_NAME` must stay `tag_image`.** That's the name the app calls
> (`CONTEXTVM_PROVIDER.toolName` in `src/lib/contextvm.ts`). If you change one you
> must change the other.

---

## Step 4 — The compose file

Still in `~/sahmstr/contextvm`, create the Docker Compose file:

```bash
nano docker-compose.yml
```

Paste:

```yaml
# SAHMstr contextVM AI server.
#
# Runs a contextVM/MCP server that exposes a single vision tool ("tag_image"),
# prices it in sats via CEP-8, and answers over wss://relay.sahmstr.com.
#
# Replace `image:` with the contextVM server image you're using. Any image that
# speaks contextVM (MCP over Nostr) with CEP-8 pricing and reads the env vars in
# .env will work; the names below are the common convention.

services:
  contextvm:
    image: ghcr.io/contextvm/server:latest   # <-- set to your chosen image
    container_name: sahmstr-contextvm
    restart: unless-stopped
    env_file: .env
    # No ports are published: the server reaches the outside world only through
    # the relay (outbound websocket). Nothing needs to be exposed publicly.
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

Save and exit.

> **On the image.** contextVM is young; pin whichever server image you settle on
> by digest once it works, so a `:latest` change can't silently break you. If you
> end up writing a small custom wrapper (a thin MCP server that calls your vision
> endpoint and prices with CEP-8), build it here with a `Dockerfile` and set
> `build: .` instead of `image:`. Either way the `.env` contract above is what it
> reads.

---

## Step 5 — Start the server

```bash
cd ~/sahmstr/contextvm
docker compose up -d
```

Watch the logs to confirm it connected to the relay and registered its tool:

```bash
docker compose logs -f
```

You're looking for lines showing it connected to `wss://relay.sahmstr.com` and
is advertising the `tag_image` tool. Press `Ctrl+C` to stop watching (the server
keeps running).

> Nothing to open in a firewall here — the server only makes an **outbound**
> websocket to your relay. Ports 80/443 for the relay and app are all you need
> public (see `docs/RELAY.md`, Firewall).

---

## Step 6 — Fund and test the pay loop before touching the app

Do a dry run so you're confident sats flow *before* users ever see it.

1. Confirm the server can **generate an invoice** (check your LNbits/wallet
   dashboard shows the server key, or the logs show a successful invoice call).
2. Confirm your wallet can **receive** — send yourself 1 sat if unsure.
3. Optionally, use a contextVM-capable client (or the app in a staging build with
   the pubkey set) to send one `tag_image` call and watch the logs go:
   request received → invoice issued → payment seen → vision call → result sent.

If the vision call errors, it's almost always the Step 1 values
(`OPENAI_BASE_URL` / `VISION_MODEL` / key). Check `docker compose logs` — the
server logs the upstream error.

---

## Step 7 — Turn it on in the app (one line)

This is the only change to the SAHMstr codebase, and it's what flips every "AI
tagging coming soon" card into a working button.

Open `src/lib/contextvm.ts` and set the provider's **hex** pubkey from Step 2:

```ts
export const CONTEXTVM_PROVIDER: ContextVMProvider = {
  pubkey: 'PASTE-THE-SERVERS-64-CHAR-HEX-PUBKEY-HERE',
  relays: ['wss://relay.sahmstr.com'],
  toolName: 'tag_image',
  estimatedSats: 25,        // keep in step with PRICE_SATS in .env
};
```

- `pubkey` **must be the 64-character hex**, not the `npub`. The app validates
  this with a regex (`isProviderConfigured`) and will keep showing "coming soon"
  if it's an npub or malformed.
- `relays` should match `RELAYS` in the server's `.env`.
- `estimatedSats` is only what the button *shows* ("About 25 sats"); the real
  price is whatever the server invoices (`PRICE_SATS`). Keep them roughly equal
  so the UI is honest.

Then rebuild and redeploy the app exactly as in `docs/DEPLOY.md`:

```bash
cd ~/sahmstr
git pull            # if you made the edit elsewhere and pushed it
npm install
npm run build
docker restart sahmstr    # or: sudo systemctl reload caddy
```

Reload `https://sahmstr.com`, open the wardrobe or pantry "Add" dialog, and the
AI tag button will now be live.

---

## Step 8 — Verify end to end (as a real user)

With a Lightning wallet connected in the app (NWC — see the wallet modal):

1. Open **Wardrobe → Add item**, choose a photo.
2. Tap **Tag with AI**. You should see: *Sending → Paying → Reading your photo →*
   fields fill in, and *"Paid N sats. Everything is editable below."*
3. Check your receiving wallet — the sats should have arrived.
4. Repeat in **Pantry → Add item** (it also offers a photo upload that
   auto-fills name/location/kind/quantity/unit).

If the button says **"Connect a Lightning wallet…"**, that's the app working
correctly — the user just has no NWC wallet connected yet.

---

## Everyday operations

| Task | Command |
|------|---------|
| Start | `cd ~/sahmstr/contextvm && docker compose up -d` |
| Stop | `docker compose down` |
| Restart | `docker compose restart` |
| Logs | `docker compose logs -f` |
| Change price | edit `PRICE_SATS` in `.env`, then `docker compose restart` (no app deploy needed) |
| Swap the "brain" | edit `OPENAI_*` / `VISION_MODEL` in `.env`, then `docker compose restart` |
| Rotate the server key | new key (Step 2) → update `.env` **and** the app's `pubkey` (Step 7) → allowlist the new key on the relay |

### Changing the price without redeploying the app

The real price is server-side (`PRICE_SATS`). You can tune it any time with a
`docker compose restart` — no app rebuild. Just remember the button's *"About N
sats"* text (`estimatedSats`) is a separate, cosmetic number; nudge it in the app
when you make a big price change so the estimate stays honest.

---

## Security notes

- The **inference API key and the wallet keys live only in `~/sahmstr/contextvm/.env`**
  on the VPS, `chmod 600`, never committed. The app bundle contains none of them —
  that's ADR-001 and ADR-013 in practice.
- The **server's Nostr private key** is likewise only in `.env`. If it leaks,
  someone could impersonate your AI server's replies; rotate it (table above).
- User requests are **NIP-44 encrypted to the server**; relays and onlookers see
  only that a `kind:25910` event exists. Results are encrypted back to the user.
- The server should **only ever answer after payment** (CEP-8). If you write or
  configure a custom server, do not return the vision result before the invoice
  is settled, or you'll give the AI away for free.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Button still says "coming soon" after Step 7 | `pubkey` is an `npub`, blank, or not 64 hex chars | Paste the **hex** pubkey; rebuild |
| "Connect a Lightning wallet…" | User has no NWC wallet | Expected — connect one in the app |
| Request times out (~90s) | Server not running, wrong relay, or not allowlisted | Check `docker compose logs`; confirm `RELAYS` matches the app; allowlist the server key on the relay |
| "AI provider returned an error" | Vision endpoint rejected the call | Check `OPENAI_BASE_URL` / `VISION_MODEL` / key in `.env`; read server logs |
| Payment succeeds but no result | Server answered before/without the result, or crashed after paying | Read logs; ensure the server returns the tool result after payment |
| Sats not arriving | Wallet receive config wrong | Verify `LNBITS_*` / `NWC_URI` against your wallet dashboard |

---

## How this fits the rest of the stack

- **The app** never changes except the one `pubkey` line — see ADR-013 for why
  the provider is deliberately a single swappable constant.
- **The relay** (`docs/RELAY.md`) carries the traffic; the server key must be on
  its allowlist.
- **The app deploy** (`docs/DEPLOY.md`) is unchanged; turning AI on is just a
  normal rebuild after editing `src/lib/contextvm.ts`.
- **Pointing at someone else's** contextVM provider instead is supported (change
  the config), but then the sats flow to that operator, not to you — which is why
  we run our own.
