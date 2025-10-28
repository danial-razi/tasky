/// <reference lib="webworker" />

// Explicitly declare the service worker scope so TypeScript understands the available APIs.
declare const self: ServiceWorkerGlobalScope;
const CACHE_NAME = 'tasky-cache-v2';
const CORE_ASSETS = [
  new URL('./', self.location.href).toString(),
  new URL('./index.html', self.location.href).toString(),
  new URL('./manifest.json', self.location.href).toString(),
];
const FALLBACK_HTML = CORE_ASSETS[1];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(
      CORE_ASSETS.map(async asset => {
        try {
          await cache.add(new Request(asset, { cache: 'reload' }));
        } catch (error) {
          console.warn(`Failed to precache ${asset}`, error);
        }
      })
    );
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith((async () => {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(event.request);

      if (!networkResponse || networkResponse.status !== 200) {
        return networkResponse;
      }

      const cache = await caches.open(CACHE_NAME);

      if (networkResponse.type === 'opaque') {
        await cache.put(event.request, networkResponse.clone());
        return networkResponse;
      }

      const responseToCache = networkResponse.clone();
      await cache.put(event.request, responseToCache);

      return networkResponse;
    } catch (error) {
      if (event.request.mode === 'navigate') {
        const fallback = await caches.match(FALLBACK_HTML);
        if (fallback) {
          return fallback;
        }
      }

      console.error('Fetching failed:', error);
      throw error;
    }
  })());
});
