// Setting up Constants for Cache Name and Urls to Cache
const CACHE_NAME = "PNG_PWA_CACHE",
  CACHE_URLS = [
    "/",
    "/assets/styles/main.css",
    "/assets/scripts/main.js",
    "/assets/scripts/utils.js",
    "/assets/img/hero-illustration.svg",
    "/assets/img/copy-icon.svg",
    "/assets/img/favicon/android-chrome-512x512.png"
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