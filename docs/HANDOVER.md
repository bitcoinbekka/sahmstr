# SAHMstr — Developer Handover

Written for a team taking ownership of this codebase. It assumes strong React and
TypeScript, and no prior Nostr experience.

Read `docs/ADR.md` alongside this. Handover tells you *how things are*; the ADR
tells you *why*, and which decisions are expensive to reverse.

---

## 1. What this is

A home economics site for mothers who use bitcoin and Nostr. Three things it
does:

1. **A 16-unit curriculum** — substantial editorial content, plus community
   contributions published to Nostr.
2. **Recipes** — user-published, readable in any Nostr long-form client.
3. **The Circle** — end-to-end encrypted photo and video sharing with a named
   family group. This is the highest-risk part of the codebase.

Plus a wardrobe/AI stylist section, and **live streaming with live chat**
(NIP-53) for cooking/baking sessions, with recorded sessions surfacing in Vlogs.

**AI photo tagging** (wardrobe + pantry) is sovereign and pay-per-use: the app
is only a client, and the AI is a separate *contextVM server* we host, paid in
sats over Lightning. See ADR-013 and `docs/CONTEXTVM.md`.

**Live streaming** (ADR-014) is NIP-53: the app owns the stream metadata and
chat; the actual video feed comes from a separate HLS streaming server that is
not yet stood up. **Media** (uploads) go to Blossom, preferring a self-hosted
`blossom.sahmstr.com` with public fallback (ADR-015, `docs/BLOSSOM.md`).

### The product thesis, because it constrains the code

The site rejects platform capitalism. No accounts we control, no ads, no data
harvesting, nothing users cannot take with them. **This is not marketing — it is
an architectural constraint.** Proposals that reintroduce a central point of
control are out of scope by default. See ADR-001 and ADR-002.

---

## 2. Getting it running

```bash
npm install
npm run dev        # http://localhost:8080
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server, hot reload |
| `npm run build` | Production build to `dist/` |
| `npm test` | **The gate:** `tsc --noEmit` → `eslint` → `vitest run` → build |
| `npm run deploy` | Build + publish via `nostr-deploy-cli` |

`npm test` is the only complete check. Run it before every PR.

### Important caveat about how this was built

This project was developed inside Shakespeare, a browser-based environment with
**no Node runtime**. Consequences you should know:

- The tests in this repo were written but **never executed**. They are expected
  to pass; treat the first `npm test` as a verification step, and fix anything
  that fails — do not assume the tests are authoritative.
- The in-browser build compiles Tailwind at runtime via a `<style
  type="text/tailwindcss">` block and resolves imports from `esm.sh`. Your local
  `npm run build` uses the normal Vite + PostCSS pipeline. **The local build is
  the authoritative one.**
- `npm run build` runs a `cp dist/index.html dist/404.html` step that the
  in-browser build does not. See ADR-008 for why that copy is deliberately not
  checked into `public/`.

---

## 3. Stack

| Concern | Choice |
|---|---|
| Framework | React 18, TypeScript, Vite |
| Styling | Tailwind 3 + shadcn/ui (Radix primitives) |
| Nostr | Nostrify (`@nostrify/nostrify`, `@nostrify/react`) |
| Data fetching | TanStack Query |
| Routing | React Router 6 |
| Head / SEO | Unhead (`useSeoMeta`) |
| Payments | WebLN + NWC via `@getalby/sdk` |
| AI (tagging) | contextVM — MCP over Nostr (`kind:25910`), CEP-8 sats payment |
| Live streaming | NIP-53 (`kind:30311` stream, `kind:1311` chat); `hls.js` player |
| Media hosting | Blossom (own server + public fallback) |
| Tests | Vitest + Testing Library, jsdom |

---

## 4. Nostr in ten minutes

Enough to be productive.

- **Identity is a keypair.** The public key (`npub`) is the user. There is no
  account, no email, no password reset. Users log in with a browser extension
  (NIP-07), a remote signer (NIP-46), or a raw key.
- **Everything is a signed event.** `{ id, pubkey, kind, content, tags, sig }`.
  The `kind` determines meaning and storage behaviour.
- **Relays are dumb pipes.** They store and serve events matching filters. They
  do not validate your application's rules — hence ADR-007.
- **Kind ranges:** `1000–9999` regular (kept), `10000–19999` replaceable (latest
  per pubkey+kind), `30000–39999` addressable (latest per pubkey+kind+`d` tag).
- **Relays only index single-letter tags.** To filter by category you must use
  `t`, not a custom multi-letter tag. This shapes all query design.

### The rule that matters most here

**We define no custom kinds.** `NIP.md` is the normative spec for every event
this app writes. If you change an event's shape, update `NIP.md` in the same
commit. Read it before touching any publish path.

### Querying

```ts
const { nostr } = useNostr();

// Filter at the relay, not in JS.
const events = await nostr.query(
  [{ kinds: [30023], '#t': ['homeec'], limit: 50 }],
  { signal },
);
```

Combine kinds into one query (`kinds: [1, 6, 16]`) rather than issuing parallel
queries — relays rate-limit, and each round trip costs latency.

---

## 5. Layout of the code

```
src/
├── components/
│   ├── ui/            shadcn primitives — avoid editing
│   ├── auth/          login, signup, account switching
│   ├── circle/        private sharing UI (composer, feed, manager)
│   ├── dm/            direct messages (disabled by default)
│   ├── live/          streaming: HlsPlayer, LiveChat, GoLiveDialog, StreamCard, StreamView
│   ├── wardrobe/      AI stylist
│   ├── AITagButton.tsx    shared "tag this photo, paid in sats" control
│   ├── Header.tsx     global nav + theme + type switcher
│   ├── PageHero.tsx   the standard section title page
│   └── PosterFrame.tsx
├── hooks/             useNostr wrappers, useCurrentUser, useTypeSetting, …
│   └── useContextVMVision.ts  the paid AI-tagging flow (request → pay → result)
├── lib/
│   ├── homeEc/        curriculum: one module per unit + posters, types
│   ├── circleCrypto.ts    AES-GCM attachment encryption
│   ├── circleGiftWrap.ts  NIP-59 seal/wrap
│   ├── contextvm.ts       the AI provider config + MCP/CEP-8 helpers
│   ├── streamTypes.ts     NIP-53 stream parsing/validation + live-staleness
│   ├── typeSettings.ts    the six typographic settings
│   └── toolkit.ts         freedom-tech links (Plebeian et al.)
├── pages/             one per route
└── test/TestApp.tsx   wraps components in all providers — use in every test
```

`App.tsx` holds the provider stack and **should not need changes**. Read it
before modifying. Add routes in `AppRouter.tsx`, above the catch-all.

---

## 6. Design system

Read ADR-004 before writing any styles.

- **Never write raw hex or literal `hsl(...)` in components.** Use semantic
  Tailwind utilities (`bg-primary`, `text-muted-foreground`) or the ink drawer
  (`text-[hsl(var(--poster-ochre))]`).
- The ink drawer lives in `src/index.css`: ochre, green, terracotta, teal,
  oxblood, sage, blue, cream, ink. Light and dark variants.
- `TONE_WASH` / `TONE_INK` in `src/lib/homeEc/posters.ts` hold gradient washes
  per tone. **These duplicate the ink drawer values and must be changed
  together** — a known wart, explained in ADR-004.
- Custom component classes: `.paper-grain`, `.halftone`, `.poster-frame`,
  `.poster-title`, `.ink-rule`.
- Typography goes through `--font-display` / `--font-body` / `--font-slab`. Use
  `font-serif` / `font-sans` / `font-slab`; never name a font family directly.

### Section pattern

Most pages open with a ruled cream hero, a terracotta small-caps eyebrow, a
`.poster-title`, and a goldenrod rule at the foot. `PageHero` implements it —
prefer it over hand-rolling. Several pages predate it and inline the same markup;
consolidating them is a good first task.

---

## 7. The Circle — read this before touching it

The highest-risk feature. Failure mode is children's photographs leaking
publicly and permanently. **Do not modify without reading ADR-003 and the Circle
section of `NIP.md` in full.**

Flow:

```
rumor (kind:20 picture / kind:22 video, UNSIGNED)
  └─ seal (kind:13, signed by author, nip44 → one recipient)
       └─ gift wrap (kind:1059, signed by a throwaway key)
```

Repeated per recipient, plus once to the author. Attachments are AES-256-GCM
encrypted *before* upload; key and nonce ride inside the rumor.

Invariants that must not be broken:

1. **The rumor stays unsigned.** Signing it makes leaked content attributable.
2. **Reject any story where the rumor `pubkey` ≠ the seal signer.** Otherwise a
   wrap can misattribute content to another author.
3. **Membership stays in encrypted private NIP-51 items.** Never write public
   `p` tags for circle members.
4. **Publish to recipients' `kind:10050` inbox relays.** A wrap on a relay the
   recipient never reads is invisible to them.
5. **Never imply recipients cannot forward.** They can. The UI says so.

Relevant tests: `circleCrypto.test.ts`, `circleGiftWrap.test.ts`,
`circleTypes.test.ts`. Keep them passing.

---

## 7a. AI photo tagging (contextVM) — how it hangs together

Read ADR-013, ADR-016, ADR-017. Photo tagging (wardrobe + pantry) can run **three
ways**; the app is always only the client, and picks a path automatically.

**One hook to rule them:** `src/hooks/useVisionTagging.ts` is what the dialogs
call. It reads the saved config (`src/lib/aiVision.ts`, localStorage) and routes:

1. **Server proxy (recommended, ADR-017).** Provider `server` in Settings. The
   browser POSTs `{ imageUrl, instruction }` to same-origin `/api/ai/tag`; a tiny
   Node service on the VPS (`ai-proxy/server.mjs`) holds the key in `.env` and
   calls the provider (xAI/Grok, OpenAI, …). **No key in the browser, no sats.**
   This is the vault pattern. Stand it up with `docs/AI_PROXY.md`.
2. **BYOK — key in this browser (ADR-016).** Provider `xai`/`openai`/… in
   Settings. `visionComplete()` calls the provider directly with a key stored in
   `localStorage`. Simplest; fine for a single operator, unsafe for a public site.
3. **contextVM — sovereign, sats-paid (ADR-013).** The fallback when no BYOK/proxy
   config is saved. `src/hooks/useContextVMVision.ts` runs the MCP-over-Nostr
   (`kind:25910`) + CEP-8 wallet-payment flow. Dormant until
   `CONTEXTVM_PROVIDER.pubkey` (hex) is set in `src/lib/contextvm.ts`.

Supporting pieces:

- `src/lib/aiVision.ts` — provider presets, `VisionConfig` (localStorage),
  `visionComplete()` (direct OpenAI-compatible call **or** the `/api/ai/tag`
  proxy when `isServerProxy()`), `isVisionConfigured()`.
- `src/components/AiSettings.tsx` — the Settings UI (provider picker; hides the
  key/model fields for the `server` option). Lives on the Settings page.
- `src/components/AITagButton.tsx` — shared control. `mode` prop tunes the copy;
  degrades to "not set up" (no config) or "connect a wallet" (contextVM, no NWC).
- `ai-proxy/server.mjs` + `ai-proxy/.env.example` — the dependency-free proxy;
  systemd unit and nginx `location /api/ai/` are in `docs/AI_PROXY.md`.

**State as of the first live deploy:** `sahmstr.com` runs the **server proxy**
against xAI. Everything is plumbed and verified end-to-end; the only open item is
that the demo xAI key needs credit + the correct current vision model id (set
`VISION_MODEL` in `ai-proxy/.env`, then `systemctl restart sahmstr-ai` — no app
rebuild). See DEMO_SUMMARY.md.

- The proxy's model/key live in `ai-proxy/.env` and change with a service
  restart — **never a site rebuild**. Same for switching providers entirely.
- Outfit generation (the stylist) still uses the old `useAIStylist` Shakespeare
  path — text-only, unrelated to the vision tagging above. A good future task is
  pointing it at the same proxy (or a text key like DeepSeek).

---

## 7b. Live streaming (NIP-53) — how it hangs together

Read ADR-014, then the streaming section of `NIP.md`.

The app owns **metadata + chat**; it never touches raw video.

- `src/lib/streamTypes.ts` — parse/validate `kind:30311`, the live-staleness
  rule (a `live` stream not updated in >1h is treated as ended).
- `src/hooks/useStreams.ts` — list all/host streams, and resolve one by `naddr`.
- `src/hooks/usePublishStream.ts` — go live / edit / end (all re-publish the same
  `d` coordinate, since 30311 is addressable).
- `src/hooks/useStreamChat.ts` — read/send `kind:1311`, plus `chatAllowlist()`.
- `src/components/live/` — `HlsPlayer` (hls.js + native Safari HLS, offline
  state), `LiveChat` (host reveal toggle for off-list messages), `GoLiveDialog`
  (host form; parses npub or hex whitelist), `StreamCard`, `StreamView`.
- `pages/Live.tsx` lists streams; `pages/StreamPage.tsx` (routed via `NIP19Page`
  for `kind:30311` naddrs) is the watch page.

**The missing piece:** the *video feed*. NIP-53 only carries a `streaming` HLS
URL — the app has no ingest server. For a demo, point a stream's URL at any HLS
`.m3u8` (even a public test stream) and everything works. Going truly live needs
an RTMP→HLS streaming server on the VPS (a follow-up runbook).

**Members-only chat** (`chat-allow` tags) is a *client-side display* policy;
real enforcement is the host relay's write policy (`docs/RELAY.md`).

---

## 8. Known state, open items, and honest gaps

### Verified working

- **Live in production at `https://sahmstr.com`** (self-hosted; see §9 and the
  deploy notes below).
- Curriculum, recipes, Circle, wardrobe, settings, theming, type switching.
- Deep-link routing (SPA fallback) confirmed live behind Caddy → nginx.
- Custom favicon, manifest, themed 404.
- **AI photo-tagging pipeline** end-to-end via the server proxy (see §7a). The
  request reaches xAI; only credit/model id remain (below).

### Not done

| Item | Notes |
|---|---|
| **`og:image`** | Absent. Social shares have no preview image. Needs an absolute URL — now that the site is live at `https://sahmstr.com`, this is the top quick win. |
| **AI key credit / model id** | The photo-tagging proxy is deployed and working, but the demo xAI key ran out of credit, and `grok-2-vision-1212` was rejected — set `VISION_MODEL` (e.g. `grok-4.6`) and add credit in `ai-proxy/.env`, then `systemctl restart sahmstr-ai`. See DEMO_SUMMARY.md. |
| **Tests never run** | See §2. First `npm test` is a verification step. Note: a real Node build surfaced missing deps (below) — treat the first CI run as authoritative. |
| **Live streaming** | Metadata + chat fully built (§7b, NIP-53). Ingest server **not deployed** but has a runbook (`docs/STREAMING.md`, MediaMTX); for demos point a stream at any HLS `.m3u8`. See ADR-014. |
| **Vlogs** | Surfaces recorded (ended) streams; still no first-class recorded-video upload. Keeps the Circle CTA for private video. |
| **`blossom.sahmstr.com`** | App prefers it (with public fallback), but the server itself is **not deployed yet**. Additive — see `docs/BLOSSOM.md`. Uploads currently land on public Blossom. |
| **DMs** | Fully implemented but **disabled** — pass `enabled: true` to `DMProvider` to turn on. Untested in production. |
| **Type switcher** | User-facing in the header. Was for evaluation; decide whether it ships. See ADR-005. |
| **`PageHero` adoption** | Several pages inline equivalent markup instead. |
| **AI stylist (outfit gen)** | Still on the old `useAIStylist` Shakespeare path; text-only. Consider routing it at the same proxy (or a DeepSeek text key). |
| **contextVM server** | The sovereign, sats-paid AI path is built but its server is **not deployed** — the proxy (ADR-017) is what's live instead. See `docs/CONTEXTVM.md`. |

### Deliberate non-obvious choices

Do not "fix" these without reading the reasoning:

- **No `404.html` in `public/`** — would pin a stale bundle hash and serve a
  blank page after the next build (ADR-008).
- **`Lock` never imported from lucide** — real crash, collides with a browser
  global (ADR-009).
- **`font-synthesis: none` on `.poster-title`** — fat faces have one weight;
  synthetic bold destroys them.
- **Font defaults duplicated in `index.css`** — load-bearing fallback if JS
  fails to apply a setting (ADR-006).
- **`blob:` in the `media-src` CSP** — required for decrypted video playback.

---

## 9. Deployment

Static output; any static host works. Runbooks cover each self-hosted piece,
written one-command-at-a-time:

| Runbook | Stands up |
|---|---|
| `docs/DEPLOY.md` | The app itself (generic Caddy + Docker recipe) |
| `docs/AI_PROXY.md` | **The live AI: a Node proxy holding the vision key server-side (ADR-017)** |
| `docs/RELAY.md` | The community relay (strfry) |
| `docs/BLOSSOM.md` | The media host (allowlisted). Additive — app has public fallback |
| `docs/CONTEXTVM.md` | The sovereign, sats-paid AI server (contextVM) — alternative to the proxy; not deployed |
| `docs/STREAMING.md` | Live video ingest (MediaMTX, RTMP→HLS) — optional; chat/listing work without it |
| `docs/STAGING.md` | A private, noindexed demo site before public launch |

### How it is ACTUALLY deployed (important — differs from `docs/DEPLOY.md`)

`docs/DEPLOY.md` describes a clean single-purpose box. The real production host
is a **shared Ubuntu VPS** (`ch-server`) that also runs several `plebeian.build`
services. The pattern there is different and must be respected:

- **Caddy runs in a Docker container** (`torii-quest-web`) and **owns 80/443 +
  all TLS**. You **append** site blocks to its Caddyfile and reload — never
  rewrite it. `sahmstr.com { reverse_proxy 172.21.0.1:8083 }` is the block.
- **Host nginx** serves the static sites on **internal ports** (vault 8081,
  houseof 8082, **sahmstr 8083**). SPA fallback + cache rules live in the nginx
  config (`/etc/nginx/sites-available/sahmstr.com`), not the Caddyfile.
- The built site is copied to **`/var/www/sahmstr.com/`**.
- The **AI proxy** runs as a systemd service (`sahmstr-ai`) on `127.0.0.1:8090`;
  nginx forwards `location /api/ai/` to it (see `docs/AI_PROXY.md`).

**The release loop on the VPS** (content update — no nginx/Caddy change):

```bash
cd ~/sahmstr && git reset --hard HEAD && git pull
npm install && npm run build
cp -r dist/* /var/www/sahmstr.com/
```

> ⚠️ **nginx reload vs restart.** After editing the nginx config, `systemctl
> reload nginx` sometimes keeps stale workers and does **not** pick up a new
> `location` block. A full `systemctl restart nginx` was required to route
> `/api/ai/`. If a config change "isn't taking", restart, don't reload.

Code is pushed to **GitHub** (`github.com/bitcoinbekka/sahmstr`) and pulled on
the VPS. (Shakespeare's own `origin` remote is a separate Nostr git; ignore it
for VPS deploys.)

### First-real-build gotchas (fixed; here so nobody re-hits them)

The project was authored in Shakespeare (browser, CDN module resolution). The
first real Node/Rollup build surfaced issues the browser build hid:

- **`react-markdown` was removed** — its deep unified/remark/mdast/micromark tree
  would not resolve under Rollup. Replaced by `src/lib/miniMarkdown.tsx`, a
  small, dependency-free renderer (used only by `CommunityUnitView`). Don't
  reintroduce `react-markdown` without a plan for that tree.
- **`.npmrc`** maps the `@jsr` scope to `https://npm.jsr.io` — Nostrify pulls JSR
  packages (`@jsr/std__encoding`) that plain npm 404s on. Keep this file.

### Staging mode

The app ships a build-time staging mode (`src/components/StagingMode.tsx`).
`VITE_STAGING=true npm run build` produces a bundle with a `noindex, nofollow`
robots tag and a "preview build" ribbon; a plain `npm run build` is the inert
production build. Used for the pre-launch demo — see `docs/STAGING.md`.

The bare static flow:

1. `npm test` — must pass.
2. `npm run build` — emits `dist/`, including `404.html`.
3. Deploy `dist/`.

Host requirements:

- **Rewrite all paths to `/index.html`** (SPA). `_redirects` and `vercel.json`
  ship in `public/`; other hosts need their own rule.
- **Do not cache `index.html`.** `_headers` sets this. A cached shell pointing at
  a deleted content-hashed bundle is the classic post-deploy blank page.
- CSP is declared in `index.html`. It permits `esm.sh` (fonts, modules) and
  `blob:` for media. Tightening it is welcome; test Circle video playback after.

### Post-deploy checklist

- [ ] Add `og:image` with an absolute URL, plus `og:url`.
- [ ] Hard-refresh and confirm no console errors.
- [ ] Test a deep link (`/tips/food-nutrition`) and a refresh on it.
- [ ] Test Circle publish + decrypt with two real accounts on different relays.
- [ ] Verify light and dark mode.

---

## 10. Conventions

- **No `any`.** Use real types; `NostrEvent`, `NostrMetadata` are exported from
  Nostrify.
- **Comments explain why, not what.** The existing codebase is commented in this
  style; match it.
- **Skeletons for structured loading**, spinners only for buttons and short
  operations.
- **Empty states** get a dashed-border card with a helpful message, never a bare
  "no results".
- **Accessibility:** dialogs and sheets need descriptions; interactive elements
  need labels and visible focus. Several past commits fixed exactly these.
- **Update `NIP.md`** in the same commit as any event-shape change.
- **Update `docs/ADR.md`** when making a decision that is costly to reverse —
  append a new entry rather than editing an old one.

---

## 11. Suggested first two weeks

1. Run `npm test`. Fix whatever fails. This validates the toolchain and gives you
   an accurate baseline.
2. Read `NIP.md` end to end, then `ADR.md`.
3. Deploy to a staging URL and add `og:image`.
4. Decide the typography question (ADR-005) and either commit to one face or keep
   the switcher deliberately.
5. Pick up `PageHero` consolidation as a low-risk way to learn the design system.
6. Only then touch the Circle, and pair on it.
