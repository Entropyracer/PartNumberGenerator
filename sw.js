// Setting up Constants for Cache Name and Urls to Cache
const CACHE_NAME = "PNG_PWA_CACHE",
  CACHE_URLS = [
    "/",
    "manifest.json",
    "/assets/styles/main.css",
    "/assets/scripts/main.js",
    "/assets/img/hero-illustration.svg",
    "/assets/img/copy-icon.svg",
    "/assets/img/favicon/android-chrome-512x512.png",
    "/assets/img/favicon/android-chrome-192x192.png",
    "/assets/img/favicon/favicon-32x32.png",
    "/assets/img/favicon/favicon-16x16.png",
    "/assets/img/favicon/icon-192x192.png",
    "/assets/img/favicon/apple-touch-icon.png",
    "/assets/img/favicon/icon-256x256.png",
    "/assets/img/favicon/icon-384x384.png",
    "/assets/img/favicon/icon-512x512.png",
    "/assets/img/favicon/mstile-150x150.png",
    "/assets/img/favicon/safari-pinned-tab.svg",
  ];
self.addEventListener("install", (event) =>
  // Opening Cache and Caching all Prescribed Files 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS))
  )
);
self.addEventListener("fetch", (event) =>
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  )
);