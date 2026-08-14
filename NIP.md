# SAHMstr Nostr Usage

SAHMstr does not define any custom event kinds. Everything it publishes uses
existing NIPs so that content remains readable in other Nostr clients.

## Contributed Home Economics Units

Community-contributed curriculum units are published as **NIP-23 long-form
content (`kind:30023`)**. We deliberately avoided a custom kind: a contributed
unit is an article, `kind:30023` is the article kind, and using it means a unit
written in SAHMstr can be read in any Nostr long-form reader.

### Tags

| Tag | Description | Required |
|-----|-------------|----------|
| `d` | Unique identifier for the unit (slug) | Yes |
| `title` | Unit title | Yes |
| `summary` | One or two sentence description | Recommended |
| `t` | Topic tags — see below | Yes |
| `image` | Header image URL | No |
| `published_at` | Unix timestamp of first publication | Recommended |

### Topic tags

Contributed units always carry two `t` tags, so they can be filtered at the
relay level rather than in the client:

- `homeec` — identifies the event as a home economics unit
- `sahmstr` — identifies the community it was written for

Authors may add further `t` tags naming the subject area, which is how a
contributed unit is associated with part of the curriculum. Suggested values
mirror the canonical units: `finance`, `food`, `textiles`, `management`,
`housing`, `housecare`, `family`, `children`, `health`, `consumer`,
`community`, `sovereignty`.

Example query for all contributed units:

```json
{ "kinds": [30023], "#t": ["homeec"], "limit": 50 }
```

### Content

The `content` field is Markdown, per NIP-23. SAHMstr encourages — but does not
require — contributors to follow the structure used throughout the canonical
curriculum, since it is the structure the whole project is built on:

1. The problem stated as a plain question
2. The enduring principle
3. How it applies today
4. Practice — specific things to do
5. Suggested activities

This convention is expressed through Markdown headings rather than through
tags, so a contributed unit degrades gracefully into an ordinary article when
read in a general-purpose client.

### Comments

Comments on contributed units use **NIP-22 (`kind:1111`)**, addressing the unit
by its `A` tag coordinate (`30023:<pubkey>:<d>`).

### Zaps

Contributed units are zappable per **NIP-57**, so contributors can be paid
directly for material other households find useful.

## The Circle — Private Family Sharing

SAHMstr's private sharing feature lets a household share photos and video with a
named group of people instead of the open network. It introduces **no custom
kinds**; it is a composition of NIP-51, NIP-59, NIP-68, and NIP-71.

### Membership: an encrypted follow set

The circle is a **NIP-51 follow set (`kind:30000`)** with the fixed identifier
`sahmstr-circle`.

| Tag | Value |
|-----|-------|
| `d` | `sahmstr-circle` |
| `title` | `Family Circle` |
| `description` | Human-readable purpose |

Members are stored as **private items**: a stringified JSON array of `p` tags,
NIP-44 encrypted to the author's own pubkey and placed in `.content`, exactly as
NIP-51 specifies. No `p` tags are written publicly.

This is deliberate. The membership of a family circle is itself sensitive
information — publishing it in the clear would reveal a mother's family and
close friends even if every photo stayed encrypted.

```json
{
  "kind": 30000,
  "content": "<nip44(JSON.stringify([[\"p\",\"<hex>\",\"\",\"Mum\"], ...]))>",
  "tags": [
    ["d", "sahmstr-circle"],
    ["title", "Family Circle"],
    ["description", "People allowed to see private stories shared from this household."]
  ]
}
```

### Stories: gift wrapped media events

A story is an ordinary media event built as a **NIP-59 rumor**, then sealed and
wrapped once per recipient:

- **Pictures** use **NIP-68 `kind:20`**
- **Short video** uses **NIP-71 `kind:22`**

Attachments are carried in **NIP-92 `imeta`** tags (`url`, `m`, `x`, `dim`,
`blurhash`, `alt`). Video rumors additionally carry a `title` tag per NIP-71, and
all rumors carry an `alt` tag for accessibility.

#### Encrypted attachments

Gift wrapping hides the caption, the author and the audience — but the file
itself would otherwise sit unencrypted on a public Blossom server, where a
sha256 URL is unguessable but permanent, and readable by the host.

So Circle attachments are **encrypted with AES-GCM before upload**, using the
scheme NIP-17 defines for `kind:15` file messages. Two extra `imeta` fields
carry the material:

| `imeta` field | Meaning |
|---------------|---------|
| `decryption-key` | Base64 AES-256-GCM key |
| `decryption-nonce` | Base64 96-bit nonce |

A fresh key and nonce are generated per file. Because these live inside the
rumor, they are only ever transmitted within the encrypted gift wrap — they
never appear on a publicly readable event. The uploaded blob is renamed to
`blob.bin` and typed `application/octet-stream`, so the host learns nothing from
the metadata either.

Clients decrypt in the browser and render from an object URL. Note that this
requires `blob:` in the `media-src` CSP directive for video playback.

The rumor is left **unsigned**, per NIP-59, so a leaked story cannot be
cryptographically attributed to its author. It is sealed (`kind:13`, signed by
the author, encrypted to one recipient) and gift wrapped (`kind:1059`, signed by
a fresh single-use key). Seal and wrap timestamps are randomised into the past;
only the rumor carries an honest `created_at`.

A separate seal and wrap is produced for **each recipient plus the author**, so
the author retains a readable copy of her own story.

```
rumor (kind:20/22, unsigned)
  └─ seal (kind:13, signed by author, nip44 → recipient)
       └─ gift wrap (kind:1059, signed by throwaway key, p-tag = recipient)
```

### Delivery

Wraps are published to each recipient's **NIP-17 `kind:10050`** inbox relays,
not to the author's write relays. This is the difference between a story that
arrives and one that silently does not: a wrap sitting on a relay the recipient
never reads is invisible to them.

Recipients with no published `kind:10050` fall back to **SAHMstr's own relay**
(`wss://relay.sahmstr.com`) — the shared home that every app user reads — rather
than the author's write relays, which the recipient may not read. This makes
app-to-app delivery reliable even when a family member has never configured
their own inbox. SAHMstr also seeds the logged-in user's `kind:10050` with the
shared relay first, and prompts them to publish it so family on other clients
can reach them too.

### Reading

Clients query only for wraps addressed to themselves:

```json
{ "kinds": [1059], "#p": ["<my pubkey>"], "limit": 200 }
```

Unwrapping happens entirely client-side. A story is rejected unless the rumor's
`pubkey` matches the seal's signer — otherwise a wrap could misattribute content
to another author. Stories are deduplicated by rumor `id`, since the author's own
copy and a recipient's copy share one.

### What this does and does not protect

Relays learn nothing beyond the existence of `kind:1059` events and the
recipient's pubkey. They cannot see the media, the caption, the author, or the
rest of the audience.

It does **not** stop a recipient from saving or forwarding what they receive.
The UI states this plainly rather than implying otherwise.

## The Pantry — Private Provisions Inventory

SAHMstr's pantry and preserving tracker is a private, cross-device inventory of
what is on a household's shelves. It introduces **no custom kind**; it is a
single **NIP-78 application-specific data event (`kind:30078`)**.

### Storage

| Tag | Value |
|-----|-------|
| `d` | `sahmstr-pantry` |
| `alt` | Human-readable description |

The item list is a JSON array **NIP-44 encrypted to the author's own pubkey**
and placed in `.content` — the same encrypt-to-self pattern the Circle uses for
its membership. The relay stores an opaque blob; only the owner can read it.

Because `kind:30078` is addressable, the latest event per `pubkey`+`d`
supersedes the previous one, so the pantry is a single evolving document rather
than an append log.

```json
{
  "kind": 30078,
  "content": "<nip44(JSON.stringify([{ id, name, location, kind, quantity, unit, bestBy?, madeOn?, note? }, ...]))>",
  "tags": [
    ["d", "sahmstr-pantry"],
    ["alt", "SAHMstr private pantry & preserving inventory"]
  ]
}
```

Each item records where it lives (`pantry` / `fridge` / `freezer` / `canning`),
whether it is a bought staple or a home preserve, a quantity and unit, and
optional `bestBy` and `madeOn` dates. The client validates every decrypted row
on read (ADR-007) and silently drops anything malformed rather than failing.

This choice is portable and durable without a backend: the inventory follows the
user to any device she logs in from, and survives clearing a browser — unlike
the device-only `localStorage` used by the wardrobe.

## AI Tagging — contextVM (MCP over Nostr)

SAHMstr's photo auto-tagging (wardrobe and pantry) is sovereign and pay-per-use.
It speaks **contextVM**: the Model Context Protocol carried over Nostr in
ephemeral **kind:25910** events, with **CEP-8** Lightning payments settled
through the user's NWC wallet.

Flow for one tagging request:

1. The client publishes a `kind:25910` event to the provider's relays, `p`-tagged
   to the provider and NIP-44 encrypted, whose content is an MCP `tools/call`
   request (`{ name: "tag_image", arguments: { image_url, instruction } }`).
2. The provider replies (also `kind:25910`, encrypted, `e`-tagged to the request)
   with a CEP-8 `notifications/payment_required` carrying a bolt11 invoice.
3. The client pays the invoice via NWC and waits.
4. The provider returns the MCP `tools/call` result; the client parses the JSON
   the tool produced into form fields.

No API key ships in the bundle and there is no backend we operate on the app
side — the AI provider is a separate contextVM server (ours, on the VPS), pointed
at via a single swappable config (`src/lib/contextvm.ts`). Payment is
peer-to-peer in sats.

## Other Kinds in Use

| Kind | Purpose | NIP |
|------|---------|-----|
| 0 | Profile metadata | NIP-01 |
| 13 | Seal (Circle stories) | NIP-59 |
| 20 | Private picture story | NIP-68 |
| 22 | Private short video story | NIP-71 |
| 25910 | AI tagging over contextVM (MCP+CEP-8) | contextVM |
| 1059 | Gift wrap (Circle stories, DMs) | NIP-59 / NIP-17 |
| 1111 | Comments | NIP-22 |
| 4 | Legacy direct messages | NIP-04 |
| 10002 | Relay list metadata | NIP-65 |
| 10050 | Inbox relays for gift wrapped events | NIP-17 |
| 30000 | Family circle membership | NIP-51 |
| 30023 | Recipes and contributed units | NIP-23 |
| 30078 | Private pantry & preserving inventory | NIP-78 |
| 9734 / 9735 | Zap requests and receipts | NIP-57 |
