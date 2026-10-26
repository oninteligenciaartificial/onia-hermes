// Basic service worker shell. Install + cache a minimal shell for fast first paint.
const CACHE_NAME = 'onia-shell-v1';
const SHELL_FILES = [
  '/',
  '/offline.html',
  '/styles/critical.css'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  // Only handle navigation requests with cache-first shell
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('/offline.html').then(cached => cached || fetch(req))
    );
    return;
  }
  // fallback to network for other assets
  event.respondWith(fetch(req).catch(()=>caches.match(req)));
});
