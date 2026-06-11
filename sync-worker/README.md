# Cloud sync for THE CONSTRUCT (optional)

The app already syncs across devices with **no setup** via the manual export/import code
(⇆ SYNC → "③ MANUAL"). This folder adds **automatic** cloud sync: deploy this tiny free
[Cloudflare Worker](https://workers.cloudflare.com/) once, paste its URL into the app, and your
progress follows your **profile code** to every device automatically.

It stores one JSON progress blob per profile code in Cloudflare KV. No accounts, no personal data.

## Deploy (~2 minutes, free)

You need a free Cloudflare account and Node installed.

```bash
cd sync-worker
npm install -g wrangler           # Cloudflare's CLI
wrangler login                    # opens a browser to authorize

# create a KV namespace and copy the printed id into wrangler.toml (id = "...")
wrangler kv namespace create CONSTRUCT

wrangler deploy                   # prints your worker URL, e.g. https://construct-sync.<you>.workers.dev
```

Then in the app: **⇆ SYNC → ② CLOUD AUTO-SYNC**, paste the worker URL, tick **auto-sync**, and hit
**SYNC NOW**. Do the same (same profile code, same URL) on your phone/other laptop — done.

## How it works
- `GET  <url>?code=ABCD-EFGH-JKLM` → `{ "save": {...} }` (or `404 {save:null}` if new)
- `PUT  <url>?code=ABCD-EFGH-JKLM` with `{ "save": {...} }` → stores it

The client merges remote + local as a **union** of cleared nodes (progress is monotonic), so there
are no destructive conflicts — sync from any device, in any order.

## Privacy / security
- The only "auth" is the profile code (a random 12-char key). Keep it private; anyone with the code
  + URL can read/write that blob.
- Want it locked down? Add a shared secret check in `worker.js`, or restrict
  `Access-Control-Allow-Origin` to your app's domain.

## Don't want Cloudflare?
Any host that implements the two routes above works (Deno Deploy, Vercel/Netlify functions, a small
Node/Express server, etc.). Point the app's sync URL at it.
