# Running the SAHMstr media server (Blossom, blossom.sahmstr.com)

A step-by-step runbook for hosting your own media server on the VPS, so photos
and video live on a disk **you** own rather than on someone else's public
server. Same one-command-at-a-time style as `docs/DEPLOY.md` and `docs/RELAY.md`.

**What you get:** `https://blossom.sahmstr.com` — a private, key-authenticated
file host for the app. Circle photos, stream cover images, and any other uploads
go here first. Locked to an **allowlist** of your family/community keys, so only
people you name can store files on your disk.

---

## What Blossom is (in one paragraph)

Nostr relays store small signed text events; they are not built for big files.
**Blossom** is the companion for files: you upload a blob, it's addressed by its
SHA-256 hash, and you get back a URL like `https://blossom.sahmstr.com/<hash>.jpg`.
Uploads are authorised by a signed Nostr event (your key), so there is no
account, password, or email. Because files are content-addressed, the same file
has the same URL on any Blossom server — no lock-in, easy mirroring.

For the Circle, the app **encrypts each photo before upload**, so this server
only ever stores ciphertext it cannot read. Running your own just means those
encrypted bytes sit on your own hardware.

**Server software:** [`hzrd149/blossom-server`](https://github.com/hzrd149/blossom-server)
— a small, well-proven Node implementation that runs comfortably in Docker
alongside the relay and app.

---

## Storage — how much disk will you need?

Photos are cheap; **video is not**. Rough guide:

| Content | Typical size |
|---|---|
| A phone photo (Circle) | 2–5 MB |
| 1 minute of 1080p video | ~50–130 MB |
| 1 hour recorded stream (1080p) | ~2–5 GB |

Implications for the VPS:

- **Photos only** (Circle, covers): tens of GB lasts a long time. A 40–80 GB
  disk is plenty to start.
- **Vlogs / recorded streams**: budget **generously** — a handful of hours of
  recorded video is tens of GB. If you plan to keep recordings, attach a larger
  data volume (say 200 GB+) or a block-storage volume you can grow.
- **Live streaming video does _not_ pass through Blossom.** The live feed goes
  through a streaming/ingest server (HLS). Blossom only stores the *recording*
  afterwards, if a host chooses to keep one, plus cover images. See
  `docs/RELAY.md` / a future `docs/STREAMING.md` for the ingest side.

You can cap usage server-side (max upload size, and an mtime-based cleanup for
old blobs) — see Step 3.

---

## Step 0 — DNS

In Njalla, add an A record for the media server pointing at your VPS IP:

| Type | Name | Value |
|------|------|-------|
| A | `blossom.sahmstr.com` | `<your VPS IP>` |

Check it resolves:

```bash
dig +short blossom.sahmstr.com
```

It should print your VPS IP.

---

## Step 1 — Get the hex pubkeys for your allowlist

The allowlist needs public keys in **hex**, not npub.

Open <https://nostrtool.com>, paste each `npub`, and copy the hex — or with
`nak`:

```bash
nak decode npub1youractualnpubhere
```

Collect the 64-character hex `pubkey` for yourself and anyone you want to allow
to upload (family, trusted community). Keep them handy for Step 3.

> Watchers and Circle *recipients* do **not** need to be on this list — it only
> governs who may **upload**. Reading a file only needs its URL.

---

## Step 2 — Put the server files on the VPS

Make a folder for the media server next to the others:

```bash
cd ~/sahmstr
mkdir -p blossom/data
cd blossom
```

`blossom/data` is where the blobs and the small database will live — this is the
folder you back up.

---

## Step 3 — Configuration (with the allowlist)

Create the config file:

```bash
nano config.yml
```

Paste this, then edit the marked lines. This config is **upload-locked to your
allowlist**, open for reads, with a size cap:

```yaml
# SAHMstr media server (blossom-server).
databasePath: data/sqlite.db

dashboard:
  enabled: false

storage:
  backend: local
  local:
    dir: ./data/blobs
  # Reject anything larger than this many bytes (here ~250 MB, room for short
  # video clips). Raise it if hosts will upload long recordings.
  rules:
    - { type: 'all', maxSize: 250mb }

upload:
  enabled: true
  # THE ALLOWLIST. Only these hex pubkeys may upload. Add one per line.
  requireAuth: true
  requirePubkeyInList: true
  pubkeys:
    - 'PUT-YOUR-64-CHAR-HEX-PUBKEY-HERE'
    # - 'another-family-members-hex-pubkey'

# Reads are open — a URL is enough to fetch a (for the Circle, encrypted) blob.
list:
  requireAuth: false
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

> The exact key names can differ slightly between `blossom-server` versions.
> If the container complains about an unknown field on first run (Step 5), check
> the project's `config.example.yml` and adjust — the *shape* above (local
> storage, an upload allowlist of hex pubkeys, open reads, a size rule) is what
> you want regardless of the exact field names.

---

## Step 4 — The compose file

```bash
nano docker-compose.yml
```

Paste:

```yaml
# SAHMstr Blossom media server.
#
# Binds to 127.0.0.1:3300 only — reachable from the server itself, with Caddy
# terminating HTTPS in front of it (Step 5). Nothing is exposed publicly here.

services:
  blossom:
    image: ghcr.io/hzrd149/blossom-server:master
    container_name: sahmstr-blossom
    restart: unless-stopped
    ports:
      - '127.0.0.1:3300:3000'
    volumes:
      - ./config.yml:/app/config.yml
      - ./data:/app/data
    logging:
      driver: json-file
      options:
        max-size: '10m'
        max-file: '3'
```

Save and exit.

---

## Step 5 — Start it

```bash
cd ~/sahmstr/blossom
docker compose up -d
docker compose logs -f
```

You want to see it start and listen on port 3000 inside the container. Press
`Ctrl+C` to stop watching (it keeps running).

---

## Step 6 — Point Caddy at it (HTTPS)

You already run Caddy for the app. Add a block so it gets a certificate and
proxies to the server. Open your Caddyfile (`~/sahmstr/Caddyfile` or a central
`/etc/caddy/Caddyfile`) and add:

```
blossom.sahmstr.com {
	reverse_proxy 127.0.0.1:3300
}
```

Reload Caddy:

```bash
# host service:
sudo systemctl reload caddy
# or Docker:
docker restart caddy
```

> Using `caddy-docker-proxy`? Add the equivalent labels to the compose service
> instead of editing a Caddyfile, the same way you did for the relay.

---

## Step 7 — Verify

1. Open `https://blossom.sahmstr.com` in a browser — you should get a response
   from the server (often a small status/JSON page), served over HTTPS.
2. In the app (logged in with an **allowlisted** key), open the Circle and add a
   photo. It should upload without error.
3. Log in with a **non-allowlisted** key and try to upload — it should be
   **rejected**. That confirms the allowlist is enforced.

Because the app tries `blossom.sahmstr.com` first and falls back to public
servers (`src/hooks/useUploadFile.ts`), an allowlisted user lands on your server
while everyone else silently uses the public fallbacks.

---

## Firewall

Only **80** and **443** need to be public (Caddy). Port **3300** is bound to
localhost and must NOT be exposed.

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

---

## Everyday operations

| Task | Command |
|------|---------|
| Start | `cd ~/sahmstr/blossom && docker compose up -d` |
| Stop | `docker compose down` |
| Restart | `docker compose restart` |
| Logs | `docker compose logs -f` |
| Edit allowlist | `nano config.yml` then `docker compose restart` |
| Disk used | `du -sh ~/sahmstr/blossom/data` |

### Adding an uploader later

1. Get their hex pubkey (Step 1).
2. `nano config.yml`, add it under `upload.pubkeys`.
3. `docker compose restart`.

---

## Backups

The whole media store is `~/sahmstr/blossom/data`. Back it up periodically:

```bash
cd ~/sahmstr/blossom
docker compose down
tar czf ~/sahmstr-blossom-backup-$(date +%F).tar.gz data/
docker compose up -d
```

Keep a copy off the server. For large video libraries, prefer syncing the
`data/blobs` directory to object storage (e.g. `rclone`) rather than tarring it
each time.

> Because files are content-addressed, you can also **mirror** to a public
> Blossom server as a backup: the same blob keeps the same URL, so nothing in
> the app breaks if you ever need to fall back to the mirror.

---

## How this fits the rest of the stack

- **The app** already prefers this server (`useUploadFile.ts`) and falls back to
  public Blossom servers if it's unreachable — so deploying this is purely
  additive and never a hard dependency.
- **The relay** (`docs/RELAY.md`) stores the events; Blossom stores the files
  the events point at.
- **The Circle** encrypts before upload, so even on your own server the bytes
  are ciphertext (ADR-003).
- **Live recordings** (Vlogs) would be stored here; the live *feed* is a
  separate streaming server (not Blossom).
