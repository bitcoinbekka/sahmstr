# Deploying SAHMstr to your VPS (Caddy + Docker)

This is a step-by-step runbook for self-hosting SAHMstr on your own server,
written to match the workflow you already used for Plebeian Scheduler.

**Domains:** `sahmstr.com` (canonical), `sahmster.com` (redirects to it).

You do everything over SSH on the VPS. Copy one command at a time.

---

## What you're deploying

SAHMstr is a **static site** — there is no backend (see `docs/ADR.md`, ADR-001).
"Deploying" just means: build the site into a `dist/` folder, then point Caddy
at that folder. Caddy handles HTTPS automatically.

---

## One-time DNS setup

In your Njalla DNS panel, point both domains at your VPS's IP address:

| Type | Name | Value |
|------|------|-------|
| A | `sahmstr.com` | `<your VPS IP>` |
| A | `www.sahmstr.com` | `<your VPS IP>` |
| A | `sahmster.com` | `<your VPS IP>` |
| A | `www.sahmster.com` | `<your VPS IP>` |

Wait a few minutes for DNS to propagate. You can check with:

```bash
dig +short sahmstr.com
```

It should print your VPS IP.

---

## Step 1 — Get the code onto the VPS

SSH in, then clone (first time) or pull (updates). You push from the VPS with a
GitHub Personal Access Token, exactly as you did for Scheduler.

First time only:

```bash
cd ~
git clone https://github.com/<your-username>/<sahmstr-repo>.git sahmstr
cd sahmstr
```

For later updates:

```bash
cd ~/sahmstr
git pull
```

---

## Step 2 — Build the site

```bash
npm install
npm run build
```

This creates a `dist/` folder. That folder is the entire website.

> Note: the local Vite build is the authoritative one. It puts hashed JS/CSS in
> `dist/assets/`. The `Caddyfile` is written to cache those correctly.

---

## Step 3 — Serve it with Caddy

The repo includes a ready-to-use `Caddyfile` at its root. It:

- serves the site over HTTPS (auto-provisioned certificate),
- redirects `sahmster.com` → `sahmstr.com`,
- never caches the HTML shell (prevents blank-page-after-deploy),
- caches hashed JS/CSS forever,
- falls back to `index.html` so deep links like `/recipes` work.

You have two ways to run it, matching however you run Caddy for Scheduler.

### Option A — Caddy running directly on the host

If Caddy is installed as a system service and reads one central Caddyfile,
append the contents of this repo's `Caddyfile` into your main config
(`/etc/caddy/Caddyfile`), then set the `root` line to your dist path, e.g.:

```
root * /home/youruser/sahmstr/dist
```

Reload Caddy (no downtime):

```bash
sudo systemctl reload caddy
```

### Option B — Caddy in Docker (the Scheduler pattern)

Run a Caddy container that mounts the built site and the Caddyfile:

```bash
docker run -d \
  --name sahmstr \
  --restart unless-stopped \
  -p 80:80 -p 443:443 \
  -v ~/sahmstr/dist:/srv \
  -v ~/sahmstr/Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data:/data \
  -v caddy_config:/config \
  caddy:latest
```

The `-v caddy_data:/data` volume is important — it persists the HTTPS
certificates so they aren't re-requested (and rate-limited) on every restart.

To update after a `git pull` + `npm run build`:

```bash
docker restart sahmstr
```

---

## Step 4 — Verify

- Visit `https://sahmstr.com` — should load with a padlock.
- Visit `https://sahmster.com` — should redirect to `sahmstr.com`.
- Visit `https://sahmstr.com/recipes` directly and refresh — should NOT 404.
- Open dev tools → Console — should be clean.
- Toggle light/dark mode.

---

## Step 5 — After the first successful deploy: add og:image

Social previews (`og:image`) need an **absolute** URL, which is why it was left
out until you had a live domain. Once the site is up, tell me and I'll:

1. Generate/choose a share image,
2. add `og:image`, `og:image:alt`, and `og:url` (`https://sahmstr.com`) to
   `index.html`,
3. you rebuild + restart.

---

## Updating the site later (the whole loop)

```bash
cd ~/sahmstr
git pull
npm install
npm run build
docker restart sahmstr     # or: sudo systemctl reload caddy
```

That's the entire release process.
