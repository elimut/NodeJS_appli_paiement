// // Mise en cache PWA
// const staticCacheName = "cache-V1";
// const assets = [
//   "/",
//   "css/auth.css",
//   "css/cart.css",
//   "css/forms.css",
//   "css/main.css",
//   "css/orders.css",
//   "css/product.css",
//   "../images/1693130967361 - OranPamuk.jpg",
// ];

// // Ajout fichier en cache
// self.addEventListener("install", (e) => {
//   e.waitUntil(
//     caches.open(staticCacheName).then(async (cache) => {
//       try {
//         console.log(assets);
//         return await cache.addAll(assets);
//       } catch (error) {
//         console.error("Failed to cache assets:", error);
//       }
//     })
//   );
// });

// // nous regardons si la requête est dans notre cache. Si tel est le cas, nous rendons ce que nous avons dans le cache, sinon le navigateur effectue la requête et la met en cache. Il existe plusieurs stratégies pour l’implémentation de l’événement “fetch” :
// // Le “online-first”: effectue la requête pour ensuite la mettre en cache, pour du fallback.
// // Le “offline-first”: permet de servir du contenu à l’utilisateur malgré une connection limitée ou inexistante.
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       // Cache hit - return response
//       if (response) {
//         return response;
//       }

//       // IMPORTANT: Cloner la requête.
//       // Une requete est un flux et est à consommation unique
//       // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
//       var fetchRequest = event.request.clone();

//       return fetch(fetchRequest).then(function (response) {
//         if (!response || response.status !== 200 || response.type !== "basic") {
//           return response;
//         }

//         // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
//         var responseToCache = response.clone();

//         caches.open(CACHE_NAME).then(function (cache) {
//           cache.put(event.request, responseToCache);
//         });

//         return response;
//       });
//     })
//   );
// });

// // Supprimer le cache
// self.addEventListener("activate", function (event) {
//   var cacheWhitelist = [CACHE_NAME];

//   event.waitUntil(
//     // Check de toutes les clés de cache.
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames.map(function (cacheName) {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });
