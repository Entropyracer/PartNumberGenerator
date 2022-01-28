self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open('sw-cache').then((cache) => {
            cache.add("assets/styles/style.css");
            cache.add("assets/scripts/main.js");
            cache.add("assets/img/hero-illustration.svg");
            cache.add("assets/img/copy-icon.svg");
            return cache.add("index.html");
        })
    )
})
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    )
})