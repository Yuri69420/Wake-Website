const CACHE_NAME = 'wake-event-cache-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/wake.jpg',
    '/Wake%20teaser.mp4'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});
