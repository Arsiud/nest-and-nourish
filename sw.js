// Caches the app so it opens quickly and offline. Bump VERSION when files change.
// Other apps share this site (arsiud.github.io), so only caches named "nn-" are ours to clear.
const VERSION = "nn-v7";
const FILES = ["./", "index.html", "style.css", "app.js", "store.js", "meals.js", "firebase-config.js", "manifest.json",
               "icon.svg", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k.startsWith("nn-") && k !== VERSION).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Network first so updates show up right away; fall back to the cache when offline.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) return;
  event.respondWith(
    fetch(event.request.url, { cache: "no-cache" })
      .then((response) => {
        if (response.ok) { const copy = response.clone(); caches.open(VERSION).then((c) => c.put(event.request, copy)); }
        return response;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match("index.html"))));
});
