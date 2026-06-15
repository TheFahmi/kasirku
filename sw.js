const CACHE_NAME = 'kasirku-v2-clear';

// Install: Skip waiting immediately
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate: hapus semua cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: bypass cache completely, always fetch from network/file
self.addEventListener('fetch', e => {
  // Hanya bypass untuk file lokal (file://) 
  // Jika gagal, kembalikan response fetch biasa
  e.respondWith(fetch(e.request));
});
