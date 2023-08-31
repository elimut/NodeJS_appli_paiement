// Mise en cache PWA
const staticCacheName = "cache-V1";
const assets = ["/", "./views/shop/index.ejs"];

// Ajout fichier en cache
self.addEventListener("install", (e) => {
  console.log("serviceWorker installé");
  e.waitUntil(caches.open(staticCacheName)).then((cache) =>
    cache.addAll(assets)
  );
});

self.addEventListener("fetch", (event) => {
  console.log(event.request);
});
