/* THE CONSTRUCT — service worker.
   Precaches the app shell (so it installs + works offline after first load).
   NETWORK-FIRST for same-origin assets: when online you always get the latest
   version; the cache is only a fallback for offline. CDN engines (Pyodide,
   sql.js, wasmoon, ruby.wasm, CodeMirror...) are cross-origin -> network. */
const CACHE = "construct-shell-v21";
const SHELL = [
  "./", "./index.html", "./css/style.css", "./manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()).catch(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return; // cross-origin (CDNs) -> default network
  // Network-first: always try the live version; fall back to cache only offline.
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then((cached) => cached || (req.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
