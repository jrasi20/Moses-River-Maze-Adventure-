/* Baby Moses River Adventure — service worker
   Strategy:
   - HTML / navigation: NETWORK-FIRST (so a freshly deployed game shows
     immediately for online players), falling back to cache when offline.
   - Static assets (images, audio, icons, fonts): CACHE-FIRST (instant,
     and works fully offline once played).
   Bump CACHE_VERSION whenever assets change to retire old caches. */
const CACHE_VERSION = 'moses-river-v3';

// Core shell + ALL images and audio (~13MB total) precached on install, so after
// the first online load the game is fully playable OFFLINE — including sound —
// with no pop-in even on the very first scan. Spaces are URL-encoded to match
// the real requests the page makes.
const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  'river-icon-192.png',
  'river-icon-512.png',
  'river-apple-touch.png',
  'assets/images/big%20snake.png',
  'assets/images/black%20bomb.png',
  'assets/images/color%20croc%205.png',
  'assets/images/crab%205.png',
  'assets/images/fish%207.png',
  'assets/images/logo%201.png',
  'assets/images/moses%20in%20basket.png',
  'assets/images/new%20ocean.jpg',
  'assets/images/newest%20princess.png',
  'assets/images/octopus%205.png',
  'assets/images/orange%20lobster.png',
  'assets/images/shark%207.png',
  'assets/images/squid%205.png',
  'assets/images/star%207.png',
  'assets/images/wave%201.png',
  'assets/images/wave%202.png',
  'assets/audio/background%20music%20loop.mp3',
  'assets/audio/bg%20music%202.mp3',
  'assets/audio/chime2.mp3',
  'assets/audio/error%203.mp3',
  'assets/audio/game%20over.mp3',
  'assets/audio/magic%20button%20click%202.mp3',
  'assets/audio/pop.mp3',
  'assets/audio/success%203.mp3',
  'assets/audio/success%204.mp3',
  'assets/audio/success%20trumpet.mp3',
  'assets/audio/uh%20oh.mp3',
  'assets/audio/water%20splash.mp3',
  'assets/audio/win%20sound.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // addAll fails the whole install if any one 404s — add individually + tolerate misses
      Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => {})))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  const isHTML = req.mode === 'navigate' ||
                 url.pathname.endsWith('/') ||
                 url.pathname.endsWith('index.html');

  if (isHTML) {
    // Network-first, bypassing the HTTP cache ({cache:'reload'}) so a freshly
    // deployed game ALWAYS wins for online players; fall back to cache offline.
    event.respondWith(
      fetch(req, { cache: 'reload' }).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match('index.html')))
    );
    return;
  }

  // Cache-first for everything else (images, audio, icons, fonts).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
