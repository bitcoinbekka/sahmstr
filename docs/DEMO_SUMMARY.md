# SAHMstr — Executive Summary (for the dev team)

A one-page picture of what SAHMstr is, what's live, and what's next. Pair this
with `docs/DEMO_SCRIPT.md` for the walkthrough, and `docs/HANDOVER.md` +
`docs/ADR.md` for the deep technical detail.

**Live now:** <https://sahmstr.com>
**Repo:** <https://github.com/bitcoinbekka/sahmstr>

---

## What it is, in one paragraph

SAHMstr is home economics for mothers on freedom tech — a full 16-unit
curriculum, user-published recipes, a wardrobe/pantry with AI photo tagging,
end-to-end encrypted family photo/video sharing ("the Circle"), and live
streaming with chat. It is built on **Nostr** (identity + data) and **Bitcoin /
Lightning** (payments), with a hard product rule: **no ads, no data harvesting,
nothing a user can't take with them.** That is an architectural constraint, not
a marketing line — the app has **no backend we control**; it is a static site
whose data lives on open Nostr relays and Blossom media servers.

## Why the architecture matters

- **The app is a static bundle.** No server, no database of users, no lock-in.
  Identity is a Nostr keypair; content is signed Nostr events readable in *any*
  Nostr client. Delete SAHMstr tomorrow and users keep everything.
- **Every server-side piece is optional, separate, and self-hostable** — the
  relay, the media host, the AI. Each degrades gracefully when absent. This is
  the whole thesis: sovereignty by construction, not by promise.
- **No custom event kinds.** Everything maps to an existing NIP (documented in
  `NIP.md`), so the data is interoperable by default.

## Feature status at a glance

| Feature | What it does | Status |
|---|---|---|
| **Curriculum** | 16 typed units of home-ec content + community contributions (`kind:30023`) | ✅ Live |
| **Recipes** | User-published long-form, readable in any Nostr client | ✅ Live |
| **The Circle** | E2E-encrypted family photo/video sharing (NIP-59 gift wrap + AES-GCM) | ✅ Live (flagship, highest-risk) |
| **Wardrobe / Pantry** | Track clothes & provisions; **AI reads a photo and fills the form** | ✅ Live; AI pipeline deployed (see below) |
| **AI photo tagging** | Vision model tags an uploaded photo | ✅ Plumbed end-to-end; needs API credit + model id |
| **Live streaming** | NIP-53 stream metadata + live chat | ✅ Metadata/chat built; video ingest not deployed |
| **DMs** | NIP-04 / NIP-17 encrypted messaging | ⚙️ Built, disabled by default |

## The AI story (the part built most recently — and the demo centerpiece)

Photo tagging is deliberately designed to run **three ways**, all behind one hook
(`useVisionTagging`), so the same UI works regardless of how AI is hosted:

1. **Server proxy (what's live, "vault pattern", ADR-017).** A tiny Node service
   on the VPS holds the API key in a `.env` and calls the vision model; the
   browser only talks to its own domain (`/api/ai/tag`). **No key in the browser,
   no key in the bundle.** This mirrors how our vault app holds its DeepSeek key.
2. **BYOK (ADR-016).** Paste a key in Settings; it stays in that browser's
   localStorage and calls the provider directly. Simple; for single-operator use.
3. **contextVM (ADR-013).** The sovereign, pay-per-use path — the user's Lightning
   wallet pays a Nostr-native AI server a few sats per photo. Built; server not
   yet deployed.

**Key operational win:** the provider, model, and key all live server-side in
`ai-proxy/.env`. Changing any of them — even switching from xAI to OpenAI — is a
one-line edit + `systemctl restart sahmstr-ai`. **Never an app rebuild.**

## What's deployed, honestly

- **App:** live at `sahmstr.com`, self-hosted on a **shared VPS** (`ch-server`)
  behind a Caddy container (TLS) → host nginx (`:8083`) → static files.
- **AI proxy:** running as a systemd service (`sahmstr-ai`, `127.0.0.1:8090`),
  fronted by nginx `/api/ai/`. Verified end-to-end — a photo request reaches xAI.
- **Relay:** a strfry relay runs on the box.
- **Not yet deployed:** own Blossom media host (public fallback in use),
  contextVM AI server, live-video ingest. All additive.

## Known gaps / immediate next steps

1. **AI key credit + model id.** The demo xAI key ran out of credit, and the
   model id `grok-2-vision-1212` was rejected — set `VISION_MODEL` (likely
   `grok-4.6`) and top up credit in `ai-proxy/.env`, restart the service. Or
   switch to OpenAI `gpt-4o-mini` (a 3-line `.env` change). **No rebuild.**
2. **`og:image`** for social sharing (needs the now-live absolute URL).
3. **Run `npm test` on real CI** — the suite was authored in-browser and never
   executed; treat the first run as a verification step.
4. **Deploy the additive services** (Blossom, contextVM, video ingest) as needed.

## The 30-second pitch for the team

> "It's a real, shippable app for a real audience, built so that we control none
> of the users' data and they can walk away with all of it. Everything is Nostr
> events and Lightning payments. The clever bit is the AI: same UI, three ways to
> host the model — including a vault-style server proxy that keeps our key off
> the client — swappable with one config line. It's live at sahmstr.com today."
