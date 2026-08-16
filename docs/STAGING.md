# Hosting a private staging / demo site

For showing SAHMstr to your dev team (or a small group) **before** the real
public launch — a working, shareable site that is *not* the live product and
won't turn up in search results.

There are two ways to do it. Pick one:

- **Option A — a VPS subdomain** (`staging.sahmstr.com`), password-protected.
  Best if you want it on your own infrastructure and pointing at your real relay.
- **Option B — a zero-setup hosted preview URL** (Netlify/Vercel/nsite). Fastest;
  no server work at all.

Either way, build the site in **staging mode** first (below) so it can never be
indexed and clearly labels itself as a preview.

---

## Step 1 (both options) — Build in staging mode

The app has a built-in "staging mode" (`src/components/StagingMode.tsx`). When
you build with the `VITE_STAGING` flag set, the site:

- adds a `noindex, nofollow` robots tag so **search engines never list it**, and
- shows a small **“Staging · preview build — not for public sharing”** ribbon so
  anyone looking at it knows it isn't the live site.

Production and staging are the *same code* — only the env var differs.

Build a staging bundle:

```bash
VITE_STAGING=true npm run build
```

That `dist/` is your staging site. (A normal `npm run build` with no flag is the
real production build, with the ribbon and noindex gone.)

> Sanity check: open `dist/index.html`’s built JS or just load the site — you
> should see the ribbon at the bottom. Production builds have neither the ribbon
> nor the robots tag.

---

## Option A — VPS subdomain (`staging.sahmstr.com`)

This runs the staging site next to (but completely separate from) the real one,
behind a password so only your dev team gets in. Your real `sahmstr.com` block
doesn’t need to exist yet, so **production stays offline**.

### A1 — DNS

| Type | Name | Value |
|------|------|-------|
| A | `staging.sahmstr.com` | `<your VPS IP>` |

```bash
dig +short staging.sahmstr.com
```

### A2 — Build and place the files

On the VPS, in your checkout:

```bash
cd ~/sahmstr
git pull
npm install
VITE_STAGING=true npm run build

# Keep the staging site in its own folder, separate from any production dist.
rm -rf ~/sahmstr-staging && cp -r dist ~/sahmstr-staging
```

### A3 — Make a password

Caddy needs a hashed password. Generate one (you’ll be prompted to type the
password your dev team will use):

```bash
docker run --rm caddy caddy hash-password
# copy the $2a$... hash it prints
```

### A4 — Caddy block

Add this to your Caddyfile (`~/sahmstr/Caddyfile` or the central one). Replace
`demo` with the username you want and paste the hash from A3:

```
staging.sahmstr.com {
	root * /home/youruser/sahmstr-staging

	# Password gate — only people with the login see anything.
	basic_auth {
		demo <PASTE-THE-$2a$-HASH-HERE>
	}

	encode zstd gzip
	@html path /index.html /404.html /manifest.webmanifest
	header @html Cache-Control "public, max-age=0, must-revalidate"
	try_files {path} /index.html
	file_server
}
```

Reload Caddy:

```bash
sudo systemctl reload caddy   # or: docker restart caddy
```

### A5 — Verify

- Visit `https://staging.sahmstr.com` — you should get a **login prompt**, then
  the site with the staging ribbon.
- Share the URL + the `demo` username and password with your dev team.
- `sahmstr.com` itself is still not served, so nothing is public.

To update the staging site after changes: repeat A2 (`git pull` → build →
copy), then `docker restart caddy` (or nothing, if Caddy serves the folder
directly — new files are picked up immediately).

---

## Option B — Hosted preview URL (fastest, no server)

Deploy the staging build to a hosted provider and get a link like
`sahmstr-demo.netlify.app`. **Nothing touches `sahmstr.com`.**

In Shakespeare this is the simplest path:

1. Configure a deploy provider in **Settings → Deploy** (Netlify, Vercel, or
   nsite — nsite works with your Nostr login and needs no third-party account).
2. Ask me (the assistant) to deploy a **staging build** — I’ll build with
   `VITE_STAGING=true` so the preview carries the noindex tag and ribbon.
3. You get a URL to send your dev team. Provider preview URLs are unlisted and,
   with the noindex tag, won’t be indexed.

Optional extra privacy: Netlify and Vercel both offer password protection on
preview deploys in their dashboards, if you want a login too.

> Which provider? If you’d rather not create an account anywhere, **nsite**
> (Nostr-native) is the least-friction option and fits the project’s ethos.
> Netlify gives you the friendliest preview URLs and easy password protection.

---

## Pointing the demo at a relay

The staging build uses the same default relays as production, which already
includes `wss://relay.sahmstr.com`. So:

- If **your relay is up** (`docs/RELAY.md`), the demo shows real data and real
  Circle delivery between accounts.
- If it **isn’t up yet**, the app still works against the public relays in the
  default list — fine for a demo. No change needed.

---

## When you’re ready to actually go live

1. Build **without** the flag: `npm run build` (no ribbon, no noindex).
2. Follow `docs/DEPLOY.md` to serve it at `sahmstr.com`.
3. Add `og:image` (see the DEPLOY post-deploy step) now that you have a public
   URL.
4. Retire the staging subdomain, or keep it around behind its password for the
   next round of changes.

---

## Quick reference

| Want | Do |
|---|---|
| A private demo build | `VITE_STAGING=true npm run build` |
| Demo on your VPS, password-gated | Option A |
| Demo with zero server setup | Option B (ask me to deploy a staging build) |
| Real public launch | `npm run build` + `docs/DEPLOY.md` |
