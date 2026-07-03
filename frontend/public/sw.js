const CACHE_NAME = 'jansankalp-pwa-cache-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/faviconjan.png',
  '/logo.png',
  '/logojansanklp.png',
];

// Installation: Cache core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Add custom offline fallback page to cache
      const offlinePage = new Response(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline | JanSankalp AI</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 50px 20px; background-color: #f3f4f6; color: #1f2937; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            h1 { color: #1e3a8a; font-size: 24px; margin-bottom: 16px; }
            p { font-size: 16px; line-height: 1.5; color: #4b5563; }
            .retry-btn { display: inline-block; margin-top: 24px; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; transition: background 0.2s; cursor: pointer; border: none; }
            .retry-btn:hover { background: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You are Offline</h1>
            <p>JanSankalp AI requires an active internet connection to contact municipal routing servers and process grievances. Please check your network connection and try again.</p>
            <button onclick="window.location.reload()" class="retry-btn">Retry Connection</button>
          </div>
        </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
      cache.put(OFFLINE_URL, offlinePage);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetching: Network first, fallback to cache/offline page
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests, skip APIs, sockets, and hot reloads
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('/socket.io/') ||
    event.request.url.includes('/ai/') ||
    event.request.url.includes('/_next/') ||
    event.request.url.includes('webpack')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for shell assets
        if (response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If HTML page request fails, show offline fallback page
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});
