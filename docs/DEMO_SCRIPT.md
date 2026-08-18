# SAHMstr — Demo Script (dev team)

A tight, ~15-minute walkthrough. Read `docs/DEMO_SUMMARY.md` first for the
framing. This script tells you exactly what to click, what to say, and what to do
if a piece isn't cooperating. **Honesty over polish** — this is a dev audience;
showing the seams (and the design behind them) lands better than pretending.

**Demo URL:** <https://sahmstr.com> · **Repo:** <https://github.com/bitcoinbekka/sahmstr>

---

## 0. Pre-flight (do this 15 min before, not live)

Run through this checklist so nothing surprises you on stage.

- [ ] Open `https://sahmstr.com` in a clean browser window. It loads with a
      padlock. Hard-refresh (Cmd/Ctrl+Shift+R) to dodge cache.
- [ ] You're **logged in with Nostr** (top-right). Have your `nsec`/extension
      ready, or a demo account. *Uploading a wardrobe photo requires login.*
- [ ] Toggle light/dark once to confirm theming.
- [ ] Visit a deep link directly (e.g. `https://sahmstr.com/tips`) and refresh —
      it must NOT 404 (proves SPA routing).
- [ ] **AI check:** on the VPS, `curl -s https://sahmstr.com/api/ai/health` →
      `{"ok":true,...}`. If the model/credit is fixed, do one real "Tag with AI"
      run in advance so you know it works.
- [ ] Have a **clothing photo** saved locally to upload during the wardrobe demo.
- [ ] Open a second tab on the GitHub repo (for the "it's all real code" beat).

> **If AI credit isn't sorted:** that's fine — see the fallback in §4. The
> *architecture* is the story, and it demos with or without a live model call.

---

## 1. The hook (1 min) — say this

> "This is SAHMstr — home economics for mothers who use Bitcoin and Nostr. The
> product rule is simple and absolute: **no ads, no data harvesting, and nothing
> a user can't take with them.** That's not a slogan — it's the architecture. The
> app has no backend we control. Everything you'll see is Nostr events and
> Lightning payments. Let me show you."

Have `sahmstr.com` on screen, landing page.

---

## 2. The product tour (4 min)

Move quickly — breadth, not depth. For each, one sentence + one click.

1. **Curriculum** (`/tips`) — "A real 16-unit home-ec curriculum. Community
   members can contribute their own units — those are published as standard
   Nostr long-form articles (`kind:30023`), so they're readable in *any* Nostr
   client, not locked in here."
2. **Recipes** — "Same idea: user-published, portable, signed by the author."
3. **The Circle** — "This is the flagship and the highest-risk feature:
   end-to-end encrypted family photo and video sharing. Gift-wrapped with NIP-59,
   attachments AES-encrypted before upload. Even we can't read them." *(Don't
   live-post children's media in a demo; describe it, or use a throwaway image.)*
4. **Wardrobe / Pantry** — "Track your clothes and provisions — and this is where
   the AI comes in. Watch." → go to §3.

---

## 3. The centerpiece — AI photo tagging (4 min)

This is the technically interesting bit. Do it live if AI credit is sorted.

1. **Wardrobe → Add Item.** Upload the clothing photo you prepared. The preview
   appears.
2. The **"Tag with AI"** button shows. Click it.
3. It fills in name, category, color, pattern, seasons, occasions from the photo.

**While it runs, say the important part:**

> "Here's the clever bit. That request did **not** put an API key in your browser.
> It went to *our own server* at `/api/ai/tag`, which holds the key in a `.env`
> file on the VPS and calls the vision model server-side — exactly how our vault
> app holds its DeepSeek key. The browser never sees the secret."

Then the punchline for a dev crowd:

> "And because the key, model, and provider all live server-side, switching from
> xAI to OpenAI — or changing the model — is a one-line `.env` edit and a service
> restart. **No app rebuild, no redeploy.** The same UI also supports two other
> backends: a paste-your-own-key mode, and a fully sovereign Lightning-paid
> Nostr-native AI. One hook, three ways to host the model."

Point at Settings → **Photo tagging AI** to show the provider picker.

---

## 4. If the live AI call fails (fallback — keep your composure)

Totally fine, and still a good beat. Say:

> "Full transparency — the demo API key is out of credit / mid-config right now.
> But notice *what* the error is: it says the **provider** returned an error. The
> whole pipeline — browser → our server → the model — is working; we just need
> credit and the right model name. And fixing that is a one-line change on the
> server, not a code change. That's the point of the design."

Then show the health endpoint working (`/api/ai/health` returns ok) to prove the
server side is alive, and show `ai-proxy/.env.example` + `docs/AI_PROXY.md` in the
repo to show how the swap works.

---

## 5. "It's all real, and it's all portable" (2 min)

Switch to the GitHub tab and the running services.

- "Everything's here — open source, on GitHub." Scroll the repo.
- "Identity is a Nostr keypair. Log in on another client with the same key and
  your profile, recipes, and contributions are all there — because they were
  never *ours* to begin with."
- "Server-side pieces — the relay, the media host, the AI proxy — are each
  **separate, optional, and self-hostable**. The app degrades gracefully when
  one's absent. We add sovereignty by construction."

---

## 6. Roadmap & the ask (2 min)

Be straight about what's next (also in `docs/DEMO_SUMMARY.md`):

- **Immediate:** AI key credit + correct model id; `og:image`; run `npm test` on
  real CI (authored in-browser, never executed).
- **Additive services to stand up:** own Blossom media host, contextVM AI server,
  live-video ingest (RTMP→HLS) so streams get a real feed.
- **Product calls for the team:** typography switcher (ship it or pick one face,
  ADR-005); migrate the outfit stylist to the same proxy; DMs on/off.

**The ask:** "I want the team's eyes on the Circle (it's the risky one — read
ADR-003 before touching it), and help hardening the deploy + CI. Where should we
point this next?"

---

## Quick reference — commands you might run on stage

```bash
# Prove the AI server side is alive (should print ok JSON):
curl -s https://sahmstr.com/api/ai/health

# Change the AI model or provider (NO app rebuild):
nano ~/sahmstr/ai-proxy/.env         # edit VISION_MODEL / keys
sudo systemctl restart sahmstr-ai

# The whole content release loop:
cd ~/sahmstr && git pull && npm install && npm run build
cp -r dist/* /var/www/sahmstr.com/
```

## Talking points if asked hard questions

- **"Isn't the AI proxy a backend? You said no backend."** — The *app* has no
  backend. The proxy is a *separate, optional, self-hostable* service, like the
  relay and media host. Anyone can run their own, or use the sovereign
  Lightning-paid path instead. The app degrades, it doesn't depend.
- **"BYOK key in localStorage — isn't that insecure?"** — Yes, which is why it's
  the single-operator option and not the default. The recommended path is the
  server proxy (key never in the browser); the most sovereign is contextVM (key
  never anywhere central). We let the operator choose their trade-off.
- **"Why no custom event kinds?"** — Interoperability. Reusing existing NIPs
  means the data reads in other Nostr clients. See `NIP.md` and ADR-002.
- **"How is this different from a normal web app with a login?"** — There's no
  account we own, no password, no server-side user table. The user's key *is* the
  account, and it works across every Nostr app. We can't lock anyone in even if
  we wanted to.
