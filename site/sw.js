// Lets pages (and the stock screen) open on weak or no mobile signal.
// Site files: try the network for 3 seconds, otherwise use the saved copy.
// Firebase library files never change for a given version, so the saved copy is used first.

const CACHE = "pharmacy-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  const network = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  network.catch(() => {});
  const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    const response = await Promise.race([network, timeout]);
    if (response) return response;
  } catch {}
  return (await cache.match(request, { ignoreSearch: true })) ?? network;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request));
  } else if (url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) {
    event.respondWith(cacheFirst(event.request));
  }
  // Everything else (the live stock data from Firestore) goes straight to the network.
});
