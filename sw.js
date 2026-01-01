const CACHE_NAME = 'asmaul-husna-v1';
const ASSETS = [
  './',
  './index.html',
  './App.tsx',
  './constants.ts',
  './types.ts',
  './index.tsx',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Cache external assets like Google Fonts or CDN scripts on the fly
          if (event.request.url.includes('google') || event.request.url.includes('aistudiocdn')) {
            cache.put(event.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});