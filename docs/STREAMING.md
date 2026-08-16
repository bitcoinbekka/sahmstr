# Running the SAHMstr live video server (RTMP → HLS, live.sahmstr.com)

A step-by-step runbook for the one piece of infrastructure the app can't provide
itself: the **video ingest server** that turns your camera/OBS feed into a web
stream. Same one-command-at-a-time style as `docs/DEPLOY.md` and `docs/RELAY.md`.

**What you get:** you stream from OBS (or your phone) to your VPS over RTMP, and
your VPS publishes it as an **HLS `.m3u8`** URL that the SAHMstr player can show.
You paste that URL into the "Go live" form, and everyone watching sees your
cooking/baking session with live chat beside it.

**Why this is separate from the app:** NIP-53 (the streaming standard SAHMstr
uses) carries only the *link* to the video, never the video itself. Video is
heavy and real-time — it belongs on a media server, not in a static bundle. So
this is a **separate, optional service**, exactly like the relay and Blossom.
Without it, streams still list and chat still works; they just have no picture.

---

## The shape of it

```
  You (OBS / phone)                 Your VPS                     Viewers
  ┌──────────────┐   RTMP push   ┌────────────────────┐   HLS    ┌──────────┐
  │  OBS Studio   │ ───────────► │  MediaMTX (Docker)  │ ──────► │  SAHMstr  │
  │  Stream key   │  rtmp://…    │   RTMP in :1935     │  .m3u8  │  player   │
  └──────────────┘              │   HLS out  :8888    │         └──────────┘
                                 └─────────┬──────────┘
                                           │ HTTPS (Caddy)
                                           ▼
                              https://live.sahmstr.com/<name>/index.m3u8
```

Three things happen:

1. **OBS pushes** your feed to the VPS over RTMP (a stream key you keep secret).
2. **MediaMTX** — a small, well-proven media server — converts it to HLS.
3. **Caddy** serves the HLS over HTTPS at `live.sahmstr.com`, and you paste that
   URL into SAHMstr's "Go live" form.

**Server software:** [MediaMTX](https://github.com/bluenviron/mediamtx) (formerly
rtsp-simple-server). One container, no database, runs on a 1 GB VPS for a handful
of viewers. For a big audience you'd put a CDN in front, but that's later.

---

## A note on scale (read before a big event)

A VPS streaming HLS directly to viewers is fine for a **demo and a small
audience** (say, up to a few dozen). Each viewer pulls the video from your box,
so bandwidth is `viewers × bitrate`. If you expect hundreds of concurrent
viewers, put a CDN (Cloudflare, bunny.net) in front of `live.sahmstr.com`, or use
a hosted stream provider and just paste *their* HLS URL into "Go live" — the app
doesn't care where the URL comes from. For Tuesday's demo, a single VPS is plenty.

---

## Step 0 — DNS

In Njalla, add an A record for the stream server:

| Type | Name | Value |
|------|------|-------|
| A | `live.sahmstr.com` | `<your VPS IP>` |

Check it resolves:

```bash
dig +short live.sahmstr.com
```

---

## Step 1 — Make a stream key

Your stream key is the secret that lets *you* (and no one else) publish. Make a
long random one and keep it private:

```bash
openssl rand -hex 16
```

Copy the output — that's your `STREAM_KEY`. You'll use it in OBS and in the
config below. Treat it like a password: anyone with it can broadcast as you.

---

## Step 2 — Put the server files on the VPS

```bash
cd ~/sahmstr
mkdir -p streaming
cd streaming
```

Create the MediaMTX config:

```bash
nano mediamtx.yml
```

Paste this. It accepts an RTMP push **only** on a path that matches your secret
key, and serves low-latency HLS:

```yaml
# SAHMstr live video server (MediaMTX).

# --- HLS output (what viewers/the app fetch) ---
hls: yes
hlsAddress: :8888
hlsAllowOrigin: "*"        # the app fetches the playlist cross-origin
hlsVariant: lowLatency     # keeps the delay to a few seconds
hlsAlwaysRemux: yes

# --- RTMP input (what OBS pushes to) ---
rtmp: yes
rtmpAddress: :1935

# Disable protocols we don't use, to reduce surface area.
rtsp: no
webrtc: no
srt: no

paths:
  # Publishers must push to  rtmp://live.sahmstr.com/<STREAM_KEY>
  # Viewers watch at         https://live.sahmstr.com/<STREAM_KEY>/index.m3u8
  # Using the key as the path name means only someone who knows it can publish.
  "PUT-YOUR-STREAM-KEY-HERE":
    source: publisher
```

Replace `PUT-YOUR-STREAM-KEY-HERE` with the key from Step 1. Save and exit
(`Ctrl+O`, `Enter`, `Ctrl+X`).

> Wanting multiple named streams later? Add more path entries, or read the
> MediaMTX docs on `authInternalUsers` for username/password publishing. The
> single-secret-path approach above is the simplest thing that's safe.

---

## Step 3 — The compose file

```bash
nano docker-compose.yml
```

Paste:

```yaml
# SAHMstr streaming server.
#
# RTMP (1935) is exposed publicly so OBS can push to it from your home.
# HLS (8888) is bound to localhost; Caddy terminates HTTPS in front of it.

services:
  mediamtx:
    image: bluenviron/mediamtx:latest
    container_name: sahmstr-streaming
    restart: unless-stopped
    ports:
      - '1935:1935'            # RTMP ingest (public — OBS pushes here)
      - '127.0.0.1:8888:8888'  # HLS (local only; Caddy proxies it)
    volumes:
      - ./mediamtx.yml:/mediamtx.yml
    logging:
      driver: json-file
      options:
        max-size: '10m'
        max-file: '3'
```

Save and exit.

---

## Step 4 — Start it

```bash
cd ~/sahmstr/streaming
docker compose up -d
docker compose logs -f
```

You should see MediaMTX start and listen on 1935 (RTMP) and 8888 (HLS). Press
`Ctrl+C` to stop watching (it keeps running).

---

## Step 5 — Point Caddy at the HLS output (HTTPS)

Open your Caddyfile (`~/sahmstr/Caddyfile` or a central one) and add a block:

```
live.sahmstr.com {
	reverse_proxy 127.0.0.1:8888
	# HLS playlists must not be cached, or viewers get stuck on an old segment.
	header Cache-Control "no-cache"
	encode gzip
}
```

Reload Caddy:

```bash
sudo systemctl reload caddy   # or: docker restart caddy
```

---

## Step 6 — Open the RTMP port in the firewall

RTMP ingest (1935) must be reachable from your home so OBS can push to it. HLS
(8888) stays local — Caddy handles the public side on 443.

```bash
sudo ufw allow 1935
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

> Only you use 1935, and it's protected by the secret key in the path. If you
> want to be stricter, restrict 1935 to your home IP in `ufw`.

---

## Step 7 — Configure OBS

On your own computer, in **OBS Studio**:

1. **Settings → Stream**
2. **Service:** Custom
3. **Server:** `rtmp://live.sahmstr.com/` *(note the trailing slash)*
4. **Stream Key:** your `STREAM_KEY` from Step 1
5. **Apply → OK**, then **Start Streaming**.

Recommended OBS output for a home connection: 1080p or 720p, 30fps, ~2500–4500
kbps, keyframe interval **2 seconds** (Settings → Output → set keyframe interval
to 2 — this matters a lot for HLS latency).

---

## Step 8 — Verify the feed

While OBS is streaming, test the HLS URL directly:

```bash
curl -sI https://live.sahmstr.com/YOUR-STREAM-KEY/index.m3u8
```

A `200 OK` means the stream is live and reachable. You can also paste that URL
into a player like VLC (**File → Open Network Stream**) to see the picture.

Your public **HLS URL** is:

```
https://live.sahmstr.com/YOUR-STREAM-KEY/index.m3u8
```

---

## Step 9 — Go live in SAHMstr

1. In the app, log in and open **Live**.
2. Click **Go live**.
3. Paste the HLS URL from Step 8 into the **Stream URL (HLS .m3u8)** field.
4. Add a title (and a cover image / members-only chat if you like) and go live.

Viewers now see your feed with live chat beside it. When you're done, click
**End stream** in the app and **Stop Streaming** in OBS.

> The stream key is in the HLS URL, so it ends up in the public kind:30311
> event. That's fine for *viewing* (you want people to watch), but it means the
> key is not truly secret once you've gone live. If you ever need to lock out a
> leaked key, change it in `mediamtx.yml` and `docker compose restart` — old URLs
> stop working immediately. For a per-stream secret, generate a fresh path each
> time.

---

## Keeping a recording (for Vlogs)

To keep sessions for rewatching in the app's Vlogs section, enable recording in
`mediamtx.yml`:

```yaml
paths:
  "YOUR-STREAM-KEY":
    source: publisher
    record: yes
    recordPath: ./recordings/%path/%Y-%m-%d_%H-%M-%S
    recordFormat: fmp4
```

Add a volume for it in the compose file (`- ./recordings:/recordings`) and
`docker compose restart`. After a stream, upload the recording to your Blossom
server (`docs/BLOSSOM.md`), then edit the stream and put that URL in a
`recording` — it will then surface under Vlogs → Past sessions.

> Recorded video is large (~2–5 GB/hour at 1080p) — see the storage notes in
> `docs/BLOSSOM.md` before you keep many.

---

## Everyday operations

| Task | Command |
|------|---------|
| Start | `cd ~/sahmstr/streaming && docker compose up -d` |
| Stop | `docker compose down` |
| Restart (after config change) | `docker compose restart` |
| Logs | `docker compose logs -f` |
| Rotate the stream key | edit `mediamtx.yml`, `docker compose restart`, update OBS |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| OBS "failed to connect" | Wrong server URL, or 1935 blocked | Server is `rtmp://live.sahmstr.com/` with trailing slash; `sudo ufw allow 1935` |
| Player shows "offline" in the app | OBS not streaming, or wrong HLS URL | Confirm OBS is live; test the `.m3u8` with `curl -I` |
| Big delay (30s+) | Keyframe interval too high | Set OBS keyframe interval to **2 seconds**; `hlsVariant: lowLatency` is on |
| Playlist 404 | Path name ≠ stream key | The path in `mediamtx.yml` must match the key in the URL/OBS exactly |
| Choppy video | Home upload bandwidth | Lower OBS bitrate/resolution |

---

## How this fits the rest of the stack

- **The app** is unchanged — it just displays whatever HLS URL you paste into
  "Go live" (ADR-014). You can equally paste a hosted provider's URL.
- **Chat** rides entirely on Nostr (kind:1311), independent of this server.
- **Recordings** live on Blossom (`docs/BLOSSOM.md`); the live feed does not.
- This is the last of the self-hosted pieces: **app + relay + Blossom + AI +
  streaming**, all on your VPS.
