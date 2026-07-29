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

## Other Kinds in Use

| Kind | Purpose | NIP |
|------|---------|-----|
| 0 | Profile metadata | NIP-01 |
| 1111 | Comments | NIP-22 |
| 4 / 1059 | Direct messages | NIP-04 / NIP-17 |
| 10002 | Relay list metadata | NIP-65 |
| 30023 | Recipes and contributed units | NIP-23 |
| 9734 / 9735 | Zap requests and receipts | NIP-57 |
