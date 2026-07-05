/* ============================================================
   JanSankalp AI — Service Worker v2
   Full PWA support: cache-first for shell, network-first for data
   ============================================================ */

const CACHE_NAME = 'jansankalp-pwa-v2';
const STATIC_CACHE = 'jansankalp-static-v2';
const DYNAMIC_CACHE = 'jansankalp-dynamic-v2';

const SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/faviconjan.png',
  '/logo.png',
  '/logojansanklp.png',
  '/grid.svg',
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline | JanSankalp AI</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 24px;
      padding: 48px 32px;
      max-width: 420px;
      width: 100%;
      text-align: center;
    }
    .icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: linear-gradient(135deg, #f97316, #4f46e5);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 36px;
    }
    h1 { font-size: 24px; font-weight: 800; margin-bottom: 12px; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
    button {
      background: linear-gradient(135deg, #f97316, #4f46e5);
      color: white;
      border: none;
      border-radius: 14px;
      padding: 14px 32px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #f97316;
      margin-bottom: 20px;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #f97316; animation: ping 1s infinite; }
    @keyframes ping { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> No Connection</div>
    <div class="icon">📡</div>
    <h1>You're Offline</h1>
    <p>JanSankalp AI needs an internet connection to reach municipal routing servers. Please check your network and try again.</p>
    <button onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>`;

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // Cache the offline fallback directly
      await cache.put('/offline', new Response(OFFLINE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
      // Try to cache shell assets (graceful — skip missing ones)
      await Promise.allSettled(
        SHELL_ASSETS.map(url =>
          cache.add(url).catch(() => console.warn(`[SW] Could not cache: ${url}`))
        )
      );
    })()
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from our own origin
  if (request.method !== 'GET') return;
  if (!url.origin.includes(self.location.origin)) return;

  // Skip: API routes, auth, sockets, Next.js internals, dev HMR
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/ai/') ||
    url.pathname.startsWith('/utils/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.includes('socket.io') ||
    url.pathname.includes('webpack') ||
    url.pathname.includes('__nextjs')
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      // 1. Try the network first (for fresh content)
      try {
        const networkResponse = await fetch(request);
        // Cache successful navigation responses dynamically
        if (networkResponse.ok && networkResponse.type === 'basic') {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        // 2. Network failed — try cache
        const cached = await caches.match(request);
        if (cached) return cached;

        // 3. For HTML navigation requests, show offline page
        if (request.headers.get('accept')?.includes('text/html')) {
          const offlinePage = await caches.match('/offline');
          if (offlinePage) return offlinePage;
        }

        // 4. Nothing available
        return new Response('Network error', { status: 503 });
      }
    })()
  );
});

// ── Push Notifications ────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'JanSankalp AI', {
      body: data.body || 'You have a new update.',
      icon: '/logo.png',
      badge: '/faviconjan.png',
      tag: data.tag || 'jansankalp-notification',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      const existingWindow = windowClients.find(c => c.url.includes(url) && 'focus' in c);
      if (existingWindow) return existingWindow.focus();
      return clients.openWindow(url);
    })
  );
});
