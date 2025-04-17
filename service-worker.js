const cacheName = 'my-pwa-cache-v3'; // Ganti versi tiap update
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
];

// INSTALL: caching aset dan aktifkan langsung
self.addEventListener('install', (event) => {
  self.skipWaiting(); // aktifkan SW baru tanpa tunggu close
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(assetsToCache);
    })
  );
});

// ACTIVATE: hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim(); // ambil kendali langsung
});

// FETCH: ambil dari cache dulu, kalau nggak ada fetch dari network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
