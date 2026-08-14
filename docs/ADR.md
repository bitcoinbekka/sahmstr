# Architecture Decision Record — SAHMstr

Status of this document: current as of the `a37683d` commit (contextVM AI). Each entry records a
decision that is expensive to reverse, the alternatives that were weighed, and
the consequences the team inherits. Entries are append-only: if a decision is
revisited, add a new entry that supersedes the old one rather than editing
history.

**Format:** each ADR states Context, Decision, Alternatives considered,
Consequences, and where relevant Revisit if — the condition under which the
decision should be reopened.

---

## ADR-001 — No backend

**Status:** Accepted

### Context

SAHMstr publishes recipes, curriculum units, comments, and private family media.
All of that is user-generated content that conventionally implies a database, an
API, and an auth system.

### Decision

There is no backend. The application is a static bundle. All persistence is
either on Nostr relays (public content, identity, social graph), Blossom servers
(media blobs), or `localStorage` (client preferences only).

### Alternatives considered

- **Conventional API + Postgres.** Rejected: it reintroduces the platform risk
  the product exists to reject. A backend is an account we can lock users out
  of, a database that can be subpoenaed, and an operating cost that eventually
  demands monetisation.
- **Hybrid — Nostr for content, backend for indexing.** Rejected for now. It is
  a defensible optimisation but it makes the system unable to run without us,
  which contradicts ADR-002.

### Consequences

- Deployable to any static host; no ops burden, no scaling story required.
- No server-side rendering, so no SEO from crawlers that do not execute JS, and
  no per-page OG images without a build-time or edge solution.
- No server-side validation. Every input constraint is advisory, and any client
  can publish malformed events to relays. Read paths must validate defensively
  (see ADR-007).
- Search, aggregation and feeds are limited to what relay filters support.

### Revisit if

Product requires full-text search across all content, or per-page social preview
images. Both are legitimate reasons to add an edge function — note that this
should be additive, never load-bearing for reading content.

---

## ADR-002 — Nostr as the system of record, with no custom event kinds

**Status:** Accepted

### Context

The application needs to store articles, recipes, comments, membership lists and
private media. Nostr allows defining new event kinds freely, which is the path of
least resistance for a perfect data fit.

### Decision

Use existing NIPs for everything. **Zero custom kinds.** Where an existing kind
is an imperfect fit, extend it with tags rather than inventing a kind.

The full mapping is documented in `NIP.md`, which is the normative reference and
must be updated in the same commit as any change to event shape.

Notable choices:

| Need | Kind used | NIP |
|---|---|---|
| Recipes, contributed units | `30023` long-form | NIP-23 |
| Comments | `1111` | NIP-22 |
| Circle membership | `30000` follow set, private items | NIP-51 |
| Private media | `20` / `22` rumors, gift wrapped | NIP-59/68/71 |
| Relay preferences | `10002`, `10050` | NIP-65, NIP-17 |
| Payments | `9734` / `9735` | NIP-57 |

### Alternatives considered

- **Custom kind for a "home economics unit."** Rejected. A unit is an article.
  Using `30023` means a unit written here is readable in any Nostr long-form
  reader, and a unit written elsewhere is readable here. Interoperability was
  judged more valuable than a tidy schema.

### Consequences

- Content outlives the application. If this site disappears, users keep
  everything, which is the product's central promise.
- We inherit the constraints of kinds designed for other purposes, and must
  express domain semantics through `t` tags.
- **Category filtering must use single-letter tags.** Relays only index those.
  Contributed units carry `t: homeec` and `t: sahmstr` so they can be filtered
  relay-side rather than fetched-then-filtered.

---

## ADR-003 — Gift-wrapped, individually encrypted private sharing (the Circle)

**Status:** Accepted

### Context

The Circle's purpose is for a mother to share images and video of her children
with named family only. This is the highest-risk feature in the product: the
failure mode is children's faces leaking permanently onto a public network.

### Decision

Compose NIP-59 gift wrapping with NIP-68/71 media events:

1. Build the media event as an **unsigned rumor**, so a leaked story cannot be
   cryptographically attributed to its author.
2. **Seal** (`kind:13`, signed by author, NIP-44 encrypted to one recipient).
3. **Gift wrap** (`kind:1059`, signed by a fresh single-use key).
4. Repeat per recipient, plus once to the author so she keeps a readable copy.
5. Randomise seal and wrap timestamps into the past; only the rumor carries an
   honest `created_at`.

Additionally — and beyond what gift wrapping alone provides — **attachments are
AES-256-GCM encrypted before upload**, using the scheme NIP-17 defines for
`kind:15` file messages. The key and nonce travel inside the rumor, so they only
ever exist within the encrypted wrap. Blobs are uploaded as `blob.bin` /
`application/octet-stream` so the host learns nothing from metadata.

Membership is stored as **private** NIP-51 items, NIP-44 encrypted to the
author's own key. No `p` tags are written publicly.

### Alternatives considered

- **Gift wrapping alone, plaintext media on Blossom.** Rejected. A sha256 URL is
  unguessable but permanent and readable by the host. That is not good enough for
  photographs of children.
- **Public `p` tags for membership.** Rejected. The membership of a family circle
  is itself sensitive — it reveals a mother's family and close friends even if
  every photo stays encrypted.

### Consequences

- Relays learn only that a `kind:1059` exists and who it is addressed to.
- **Publishing cost is O(recipients).** A story to 10 people is 10 seals and 10
  wraps, all client-side. This is the accepted price of per-recipient encryption
  and it bounds practical circle size.
- Delivery depends on recipients publishing `kind:10050` inbox relays. Where
  absent, we fall back to author write relays and **the UI says delivery is not
  guaranteed** rather than implying success.
- Video playback requires `blob:` in the `media-src` CSP directive, because
  decryption happens in-browser and plays from an object URL.
- **It does not prevent a recipient saving or forwarding.** The UI states this
  plainly. Do not add copy that implies otherwise.

### Revisit if

Circle sizes grow beyond ~25, where O(n) publishing becomes a UX problem. A
shared-key scheme would scale better but loses per-recipient revocation.

---

## ADR-004 — Design system: CSS custom properties, not hardcoded colour

**Status:** Accepted (supersedes an earlier ad-hoc approach)

### Context

The visual identity is a c. 1880–1920 lithographic travel-poster aesthetic. It
went through three iterations, and each time colours had been hardcoded into
components, the retheme was expensive and left inconsistent stragglers.

### Decision

All colour flows through HSL CSS custom properties in `src/index.css`, in two
layers:

1. **Semantic shadcn tokens** — `--background`, `--primary`, `--muted`, etc.
   Components use these via Tailwind utilities.
2. **The "ink drawer"** — `--poster-ochre`, `--poster-green`,
   `--poster-terracotta`, `--poster-teal`, `--poster-oxblood`, `--poster-sage`,
   `--poster-blue`, `--poster-cream`, `--poster-ink`. Named period inks for
   accents, referenced as `hsl(var(--poster-ochre))`.

Gradient washes per tone live in `TONE_WASH` / `TONE_INK` in
`src/lib/homeEc/posters.ts` and **must stay in step with the ink drawer**.

### Consequences

- A retheme is one file. Dark mode is a parallel set of the same tokens.
- **Two sources of truth exist** — the CSS ink drawer and `TONE_WASH`. This is a
  known wart: Tailwind gradient utilities cannot read arbitrary runtime vars in
  the `from-`/`to-` position, so the washes are literal HSL. Change both together.
- New code must never introduce raw hex or literal `hsl(...)` colour. Several
  rounds of cleanup were needed to remove exactly that.

---

## ADR-005 — Runtime-switchable typography

**Status:** Superseded by ADR-012

### Context

The palette rework did not deliver the intended period feel, because the fonts
were contemporary (Playfair Display, 2011; Bitter, a modern screen slab).
Typography carries more of the era than colour does. The right face was a matter
of taste that could not be resolved by argument.

### Decision

Ship **six complete typographic settings**, each a real historical category with
a display, body and label face: Didone (Bodoni), Fat Face (Abril), Egyptian slab
(Alfa Slab), Old Style (Garamond), Wood Type (Rye), plus the original Playfair
for comparison. Default: **Didone**.

Faces resolve through `--font-display`, `--font-body`, `--font-slab`. Tailwind's
`font-serif` / `font-sans` / `font-slab` map to those variables, so switching a
setting rewrites three properties and restyles the entire site with no refetch.

Each setting also carries its own `displayTracking`, `displayLeading` and
`displayWeight`, because a fat face and a Didone cannot share optical metrics at
the same size.

### Consequences

- All nine font families load up front (~112 woff2 references, subset by
  `unicode-range`). Acceptable relative to the poster imagery, but it is the
  largest single cost of this decision.
- Fat faces and wood type ship **one weight**. `font-synthesis: none` is set on
  `.poster-title` to stop browsers faking bold and closing up the counters.
- The switcher is currently **user-facing** in the header. This was for
  evaluation. **Open question for the team:** decide whether it ships as a
  feature or is removed once a face is chosen.
- Typography is decoration, so it must never break rendering — see ADR-006.

---

## ADR-006 — Decoration must fail safe

**Status:** Accepted

### Context

A refactor left a storage-key constant undefined inside `useTypeSetting`. That
hook runs in `Header`, which renders on every page, so the ErrorBoundary caught
it and **the entire site went blank**. A cosmetic font preference took down the
whole application.

### Decision

Any non-essential subsystem must degrade rather than throw:

- `applyTypeSetting()` is wrapped end to end; unknown ids, frozen style objects
  and absent DOM all fall through to the CSS defaults.
- `useTypeSetting` owns its own storage access with guards at every step rather
  than depending on a generic helper, and persistence is best-effort so private
  browsing or a full quota cannot break render.
- Tests assert the Header renders with corrupt and unknown stored values.

### Consequences

- The worst case for a typography failure is the default face, not a white page.
- This principle should be applied to any future decorative subsystem —
  animation preferences, theme extras, layout toggles.

### Note for reviewers

The default values in `index.css` are load-bearing. They are what the site falls
back to. Do not remove them on the assumption that JS always sets them.

---

## ADR-007 — Validate events on read

**Status:** Accepted

### Context

There is no backend (ADR-001), so any client can publish malformed events that
match our filters. Relays do not validate application semantics.

### Decision

Every read path that depends on required tags or structured content filters
results through a validator before use. Kinds with freeform content and optional
tags (e.g. `kind:1`) do not need this; kinds with required tags do.

For the Circle specifically, a story is **rejected unless the rumor's `pubkey`
matches the seal's signer** — otherwise a wrap could misattribute content to
another author. Stories are deduplicated by rumor `id`, since author and
recipient copies share one.

### Consequences

- Malformed events are dropped silently rather than crashing a feed.
- Validators are the de facto schema. Keep them beside the types they guard.

---

## ADR-008 — Client-side routing with host-level fallbacks

**Status:** Accepted

### Context

React Router with `BrowserRouter` gives clean URLs, but a static host will 404 on
a direct hit to `/recipes` unless told to serve the shell.

### Decision

Ship host configuration in `public/`:

- `_redirects` — Netlify SPA rewrite.
- `vercel.json` — equivalent rewrite for Vercel.
- `_headers` — **never cache `index.html`**, cache content-hashed bundles
  immutably for a year.

NIP-19 identifiers are handled at the **root** (`/:nip19`), not nested under
`/note/...`, per NIP-19 convention.

### Alternatives considered

- **A `404.html` copy of the shell.** Explicitly rejected. Copying `index.html`
  pins the current content-hashed bundle filename; after the next build that
  script no longer exists and the 404 route serves a **blank page**. Worse than
  no file at all.

### Consequences

- Deep links and refreshes work on Netlify and Vercel. **Other hosts need their
  own rewrite rule** — this is the first thing to check on a new target.
- The `_headers` cache policy is what prevents the classic post-deploy blank
  page, where a cached shell references a deleted bundle.

---

## ADR-009 — `Lock` is banned from lucide imports

**Status:** Accepted

### Context

`import { Lock } from 'lucide-react'` caused a hard runtime crash: "Illegal
constructor."

### Decision

Never import lucide's `Lock`. Use `ShieldCheck`, which carries the same meaning.

### Rationale

`Lock` collides with the Web Locks API `Lock` global. Under the ESM CDN build the
named import can resolve to the **native class** instead of the icon component,
which React then tries to call as a function.

### Consequences

This is a real, reproduced bug, not superstition. The prohibition is noted in
comments at the import sites. If other icon names collide with browser globals,
the same treatment applies.

---

## ADR-010 — Curriculum as typed source modules

**Status:** Accepted

### Context

The canonical curriculum is 16 units of substantial editorial content. It could
live in a CMS, in Markdown, or in the codebase.

### Decision

Canonical units are **typed TypeScript modules** in `src/lib/homeEc/`, one file
per unit, conforming to shared types in `types.ts`. Community contributions are
Nostr events (ADR-002).

### Consequences

- The compiler enforces unit shape; a malformed unit fails the build, not
  production.
- Editorial changes require a deploy. Accepted: the canonical curriculum is
  intended to be stable and reviewed, unlike contributions.
- Two rendering paths exist — `HomeEcModule` for canonical, `CommunityUnitView`
  for contributed. Keep them visually consistent.

---

## ADR-011 — Private personal data: encrypt-to-self on Nostr, not localStorage

**Status:** Accepted

### Context

Some features hold data that is personal but not social: the pantry inventory,
and (retroactively) the wardrobe. It has to persist, but it is nobody's business
but the owner's, and there is no backend (ADR-001).

### Decision

Private personal collections are stored as a single **NIP-78 addressable event
(`kind:30078`)** with a feature-specific `d` tag, whose `.content` is the payload
**NIP-44 encrypted to the author's own pubkey**. The pantry (`d:sahmstr-pantry`)
is the first to use this.

### Alternatives considered

- **`localStorage`** (as the wardrobe does). Rejected for new work: it is
  device-only, so the data does not follow the user to her phone, and it is lost
  when a browser is cleared. Acceptable for the wardrobe's throwaway styling
  data; not acceptable for an inventory she is expected to maintain over time.
- **A custom kind.** Rejected per ADR-002. NIP-78 exists precisely for
  app-specific data and needs no new kind.

### Consequences

- Private, portable, durable, and backend-free — the data syncs across devices
  via relays the user already uses, and the relay only ever sees an opaque blob.
- Requires a NIP-44 capable signer. Where absent, the feature degrades to
  read-only/empty with a clear message rather than throwing (ADR-006 spirit).
- Read paths must validate decrypted rows (ADR-007); a corrupt payload drops bad
  rows rather than crashing.
- The wardrobe remains on `localStorage` for now; migrating it to this pattern
  is a reasonable future task but not required.

---

## ADR-012 — Soft-modern rebrand; one locked typeface (supersedes ADR-005)

**Status:** Accepted

### Context

The c. 1880–1920 lithographic poster identity (ADR-004) and the six-way
typography experiment (ADR-005) were evaluated on the running site and judged
too "old-timey" for the audience. The owner asked for a soft, modern, premium
feel in the vein of contemporary lifestyle brands (Lululemon was the reference).

### Decision

1. **Palette:** the ink drawer variable *names* in `index.css` are retained
   (so components need not change, per ADR-004), but the *values* are re-mapped
   to a muted, earthy, soft-modern set — warm off-white ground, sage as the
   signature, soft clay and dusty accents, warm-charcoal dark mode. Rounding is
   increased (`--radius: 0.9rem`).
2. **Typography:** the six historical settings and the runtime switcher are
   retired. The site is locked to one modern voice — **Inter** throughout.
   `applyTypeSetting()` now resolves every id to that one setting, preserving
   the fail-safe contract of ADR-006. The switcher UI is removed from the header
   and Settings.
3. **Decoration:** paper grain and halftone become no-op hooks; the letterpress
   text-shadow and the four-ink hard-stop rule are replaced with clean surfaces
   and a single soft sage rule.

### Consequences

- `TONE_WASH` / `TONE_INK` in `posters.ts` were updated in step with the new
  drawer (the ADR-004 two-sources-of-truth wart still applies — change together).
- The poster *images* themselves are still the old vintage plates. They read as
  warm illustration against the new palette; replacing them with softer imagery
  is a reasonable future task but was out of scope for the rebrand.
- `typeSettings.ts` keeps its exported types/constants so existing imports and
  tests compile; the historical face definitions are now inert.
- The unused vintage font packages are no longer imported (only Inter loads),
  which shrinks the font payload considerably versus ADR-005's ~112 woff2 refs.

---

## ADR-013 — AI features are sovereign and pay-per-use via contextVM

**Status:** Accepted

### Context

The wardrobe and pantry benefit from vision AI (auto-tagging a photo into form
fields). The original wardrobe stylist called the Shakespeare AI API directly.
For the product's ethos — and as a revenue path — the owner wanted a
sats-native model rather than a hosted key or a subscription backend.

### Decision

AI tagging runs over **contextVM** (MCP over Nostr, `kind:25910`) with **CEP-8**
Lightning payments settled through the user's existing NWC wallet:

- The app is only the **client**. It holds no API key and operates no backend.
- The AI itself is a separate **contextVM server we run** (on the VPS), pointed
  at by a single swappable config in `src/lib/contextvm.ts`
  (`CONTEXTVM_PROVIDER`: pubkey, relays, tool name, indicative price).
- The client encrypts requests to the provider (NIP-44), pays the returned
  invoice via NWC, and parses the tool result into form fields.
- The AI "brain" behind the server is deliberately swappable (any
  OpenAI-compatible endpoint — a hosted open model like Qwen2.5-VL, or a
  self-hosted model later) and is a server-side concern, invisible to the app.

### Alternatives considered

- **Hosted key + premium subscription.** Rejected as the primary path: it needs
  a backend to keep the key secret and track subscribers, reintroducing the
  platform dependency ADR-001 rejects. Could be layered on later via CEP-8's
  `waive` (prepaid/subscription) mechanism without changing the client.
- **Point at a public third-party contextVM provider.** Viable and the client
  supports it (just change the config), but the sats then flow to that operator,
  not to us — so running our own is the revenue path.

### Consequences

- Revenue accrues in sats directly to the provider's wallet; pricing is set
  server-side (`resolvePrice`), so it can be tuned without an app deploy.
- Requires the user to have an NWC wallet connected; the UI degrades honestly
  when one is absent, and when no provider is configured yet.
- Until the server is deployed, `CONTEXTVM_PROVIDER.pubkey` is empty and the UI
  shows an "AI tagging coming soon" state rather than failing.
- The old `useAIStylist` Shakespeare path is superseded for tagging; outfit
  generation still uses it and can migrate to contextVM later if desired.

### Operational reality

- The server is **not the app's concern**. It is a separate Nostr identity
  running on the VPS, allowlisted on `wss://relay.sahmstr.com`, pointed at any
  OpenAI-compatible vision endpoint. Standing it up is documented step by step in
  **`docs/CONTEXTVM.md`** — that runbook is the counterpart to this decision.
- **Turning AI on is a one-line app change:** set `CONTEXTVM_PROVIDER.pubkey` in
  `src/lib/contextvm.ts` to the server's 64-char **hex** pubkey and redeploy. Until
  then `isProviderConfigured` is false and every AI control renders a "coming
  soon" state (see `AITagButton`).
- **Price is server-side and app-side.** The invoice amount (`PRICE_SATS` on the
  server) is authoritative and tunable without an app deploy; `estimatedSats` in
  the config is only the cosmetic "About N sats" the button shows. Keep them
  roughly in step so the UI stays honest.
- `toolName` (`tag_image`) is a contract shared by the app config and the
  server's `.env`. Change one, change the other.

### Revisit if

The contextVM ecosystem or server images change materially, or if a hosted
premium tier is wanted — CEP-8's `waive` (prepaid/subscription) mechanism can be
layered on server-side without touching the client, per the alternatives above.
