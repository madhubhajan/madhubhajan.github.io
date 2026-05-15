/**
 * Service worker — caches app shell for faster load / basic offline UI.
 * Bhajan MP3 files always load from network (not cached here).
 */

const CACHE_NAME = "madhubhajan-v3";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/js/firebase-config.js",
  "/js/firestore.js",
  "/js/auth.js",
  "/js/app.js",
  "/js/premium.js",
  "/js/pwa.js",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.pathname.endsWith(".mp3")) {
    return;
  }

  if (url.origin.includes("googleapis.com") || url.origin.includes("gstatic.com")) {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
