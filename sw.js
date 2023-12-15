const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/mic.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(error => {
                            console.error(`Caching failed for ${url}:`, error);
                        });
                    })
                );
            })
    );
});
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                });
            })
    );
});