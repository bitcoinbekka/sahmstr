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

Read ADR-013, then `docs/CONTEXTVM.md` (the server runbook).

The app is **only the client**. There is no API key in the bundle and no backend
we run. The AI is a separate **contextVM server** (MCP over Nostr, `kind:25910`)
that we host on the VPS; the user pays it a few sats per photo via their NWC
wallet (CEP-8), and it reads the image into form fields.

- `src/lib/contextvm.ts` — `CONTEXTVM_PROVIDER` is a single **swappable config**
  (server pubkey, relays, tool name `tag_image`, indicative price) plus the
  MCP/CEP-8 helpers. `isProviderConfigured` gates the whole feature.
- `src/hooks/useContextVMVision.ts` — the flow: encrypt request → publish →
  handle `payment_required` (pay via NWC) → return the tool result. 90s timeout,
  honest error/degraded states.
- `src/components/AITagButton.tsx` — the shared control. Used by the wardrobe
  `AddItemDialog` and the pantry `AddPantryItem`. States the price up front;
  degrades to "coming soon" (no provider) or "connect a wallet" (no NWC).

**The switch that turns it on:** `CONTEXTVM_PROVIDER.pubkey` is **empty** in the
repo, so the UI shows "AI tagging coming soon" everywhere. Once the server is
deployed (`docs/CONTEXTVM.md`), paste its 64-char **hex** pubkey into that one
line and redeploy. Nothing else changes.

- Price is authoritative **server-side** (tunable without an app deploy);
  `estimatedSats` is only the cosmetic "About N sats" the button shows.
- `toolName` must match the server's config on both sides (`tag_image`).
- Outfit generation still uses the old `useAIStylist` Shakespeare path; only
  tagging moved to contextVM.

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

- Build clean, no console errors at `74426d2`.
- Curriculum, recipes, Circle, wardrobe, settings, theming, type switching.
- Deep-link routing configured for Netlify and Vercel.
- Custom favicon, manifest, themed 404.

### Not done

| Item | Notes |
|---|---|
| **`og:image`** | Absent. Social shares have no preview image. Needs an absolute URL, so it can only be added once deployed. **Do this first after deploy.** |
| **Tests never run** | See §2. First `npm test` is a verification step. |
| **Live streaming** | Metadata + chat fully built (§7b, NIP-53). Ingest server **not deployed** but now has a runbook (`docs/STREAMING.md`, MediaMTX); for demos point a stream at any HLS `.m3u8`. See ADR-014. |
| **Vlogs** | Now surfaces recorded (ended) streams; still no first-class recorded-video upload. Keeps the Circle CTA for private video. |
| **`blossom.sahmstr.com`** | App already prefers it (with public fallback), but the server itself is **not deployed yet**. Additive — see `docs/BLOSSOM.md`. |
| **DMs** | Fully implemented but **disabled** — pass `enabled: true` to `DMProvider` to turn on. Untested in production. |
| **Type switcher** | User-facing in the header. Was for evaluation; decide whether it ships. See ADR-005. |
| **`PageHero` adoption** | Several pages inline equivalent markup instead. |
| **AI stylist (outfit gen)** | Still on the old `useAIStylist` Shakespeare path; review cost/failure handling, or migrate it to contextVM like tagging. |
| **AI photo tagging** | Fully built (§7a) but **dormant** until the contextVM server is deployed and its hex pubkey is pasted into `CONTEXTVM_PROVIDER`. See `docs/CONTEXTVM.md`. |

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

Static output; any static host works. In practice the project is self-hosted on
a VPS behind Caddy, with its own relay, media host, and (optionally) AI server.
Runbooks cover each, written one-command-at-a-time:

| Runbook | Stands up |
|---|---|
| `docs/DEPLOY.md` | The app itself (Caddy + Docker) on `sahmstr.com` |
| `docs/RELAY.md` | The community relay `wss://relay.sahmstr.com` (strfry) |
| `docs/BLOSSOM.md` | The media host `blossom.sahmstr.com` (allowlisted). Additive — app has public fallback |
| `docs/CONTEXTVM.md` | The sovereign, pay-per-use AI server (contextVM) — optional; AI features stay dormant without it |
| `docs/STREAMING.md` | Live video ingest (MediaMTX, RTMP→HLS) so streams have a real feed — optional; chat/listing work without it |
| `docs/STAGING.md` | A private, noindexed demo site (VPS subdomain or hosted preview) before public launch |

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
