// Mise en cache PWA
const staticCacheName = "cache-V1";
const assets = ["/"];

// Ajout fichier en cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then(async (cache) => {
      try {
        return await cache.addAll(assets);
      } catch (error) {
        console.error("Failed to cache assets:", error);
      }
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log(event.request);
});
