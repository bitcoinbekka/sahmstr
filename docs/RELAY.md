# Running the SAHMstr relay (relay.sahmstr.com)

A step-by-step runbook for hosting your own Nostr relay on the VPS, alongside
the app. Same one-command-at-a-time style as `docs/DEPLOY.md`.

**What you get:** `wss://relay.sahmstr.com` — a fast community relay where
SAHMstr content lives, and where private Circle stories can be delivered
reliably between app users.

**Relay software:** [strfry](https://github.com/hoytech/strfry) — a small, fast,
well-proven relay. It runs comfortably on a 1 GB VPS.

**Policy we're setting up:** open to *read* by anyone; *writing* is limited to
an allowlist of members you choose — **except** private gift-wrapped messages,
which anyone may deliver to your users (otherwise the Circle and DMs wouldn't
work). You can flip it fully open later with one setting.

The config files live in this repo under `relay/`:

| File | Purpose |
|------|---------|
| `relay/strfry.conf` | Relay settings + NIP-11 info |
| `relay/write-policy.js` | Who may write (the allowlist) |
| `relay/docker-compose.yml` | Runs strfry via Docker |

---

## Step 0 — DNS

In Njalla, add an A record for the relay pointing at your VPS IP:

| Type | Name | Value |
|------|------|-------|
| A | `relay.sahmstr.com` | `<your VPS IP>` |

Check it resolves:

```bash
dig +short relay.sahmstr.com
```

It should print your VPS IP.

---

## Step 1 — Get your hex pubkey

The relay config and the allowlist need your public key in **hex**, not npub.

Easiest way: open <https://nostrtool.com>, paste your `npub`, and copy the hex.
Or, if you have `nak` installed:

```bash
nak decode npub1youractualnpubhere
```

Copy the 64-character `pubkey` value. Keep it handy — you'll paste it twice.

---

## Step 2 — Put the relay files on the VPS

The `relay/` folder is already in the repo you cloned for the app. SSH in and
go to it:

```bash
cd ~/sahmstr/relay
```

Create the data directory the database will live in:

```bash
mkdir -p data
```

---

## Step 3 — Fill in your details

Edit the config:

```bash
nano strfry.conf
```

In the `info { ... }` block, set:

- `pubkey` → your hex pubkey from Step 1
- `contact` → your email (already `hello@sahmstr.com`, change if you like)

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

Now the allowlist:

```bash
nano write-policy.js
```

Find the `ALLOWLIST` block near the top and add your hex pubkey, e.g.:

```js
const ALLOWLIST = new Set([
  'a1b2c3...your64charhexpubkey...f9',
]);
```

Add trusted family/community hex pubkeys here too, one per line. Save and exit.

> Reminder: you do NOT need to allowlist people just so they can *receive*
> Circle stories or DMs — gift wraps (kind 1059) are always accepted. The
> allowlist is only about who may publish public content to your relay.

---

## Step 4 — Start the relay

The compose file is set up for **plain Caddy** by default (it binds the relay
to `127.0.0.1:7777`, reachable only from the server itself).

```bash
docker compose up -d
```

Watch the logs to confirm it started:

```bash
docker compose logs -f
```

You should see strfry listening on `0.0.0.0:7777`. Press `Ctrl+C` to stop
watching (the relay keeps running).

---

## Step 5 — Point Caddy at it (HTTPS)

You already run Caddy for the app. Add a block for the relay so Caddy gets an
HTTPS certificate and proxies the websocket through to strfry.

Open your Caddyfile (wherever you keep it — the app's is in `~/sahmstr/Caddyfile`,
or you may have a central `/etc/caddy/Caddyfile`) and add:

```
relay.sahmstr.com {
	reverse_proxy 127.0.0.1:7777
}
```

That single block is all a relay needs — Caddy handles websocket upgrades
automatically. Reload Caddy:

```bash
# If Caddy runs as a host service:
sudo systemctl reload caddy

# If Caddy runs in Docker:
docker restart caddy
```

> Using `caddy-docker-proxy` instead of a Caddyfile? Then don't edit a
> Caddyfile — open `relay/docker-compose.yml`, switch from Approach A to
> Approach B (remove the `ports:` block, uncomment the `networks:`/`labels:`
> blocks and the external network), create the network with
> `docker network create caddy`, and `docker compose up -d`. Full notes are in
> the compose file's comments.

---

## Step 6 — Verify

1. Open `https://relay.sahmstr.com` in a browser. You should see a small JSON
   document — that's the relay's NIP-11 info (its name, description, etc.).

2. From a Nostr client, add `wss://relay.sahmstr.com` to your relay list and
   publish a note **from an allowlisted key**. It should succeed.

3. Publish from a NON-allowlisted key. It should be **rejected** with the
   "restricted" message. That confirms the write policy is working.

4. Some stats any time:

```bash
docker exec sahmstr-relay strfry info
```

---

## Firewall

Only ports **80** and **443** need to be open to the public (Caddy). Port 7777
is bound to localhost and must NOT be exposed. If you use `ufw`:

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

---

## Everyday operations

| Task | Command |
|------|---------|
| Start | `cd ~/sahmstr/relay && docker compose up -d` |
| Stop | `docker compose down` |
| Restart | `docker compose restart` |
| Logs | `docker compose logs -f` |
| Edit allowlist | `nano write-policy.js` then `docker compose restart` |
| DB / relay stats | `docker exec sahmstr-relay strfry info` |

### Adding a member later

1. Get their hex pubkey (Step 1).
2. `nano write-policy.js`, add it to `ALLOWLIST`.
3. `docker compose restart`.

### Going fully open

If you ever want to accept writes from anyone, edit `write-policy.js` and set
`const OPEN_WRITE = true;`, then `docker compose restart`. (Expect spam over
time — the allowlist exists for a reason.)

---

## Backups

The whole relay database is the `relay/data/` folder. To back it up, stop the
relay briefly and copy it:

```bash
cd ~/sahmstr/relay
docker compose down
tar czf ~/sahmstr-relay-backup-$(date +%F).tar.gz data/
docker compose up -d
```

Keep a copy off the server.

---

## Once the relay is live: wiring the app to it

After `wss://relay.sahmstr.com` is up and verified, come back to me in
Shakespeare and I'll (step 3 of our plan):

1. Add `wss://relay.sahmstr.com` to the app's default relay list, so new users
   read and write there out of the box.
2. Default new users' Circle inbox relays to include it, so private stories
   are delivered reliably between SAHMstr users automatically.
3. Rewrite the Circle's reachability messaging to be warm and clear instead of
   the current "delivery not guaranteed" warning.

That is the change that makes the Circle "just work" for families on the app.
