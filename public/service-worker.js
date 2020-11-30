// const STATIC_CACHE = "static-cache-v1";
// const RUNTIME_CACHE = "runtime-cache";
// const FILES_TO_CACHE = [
//   "/",
//   "/index.html",
//   "./index.js",
//   "/manifest.webmanifest",
//   "/styles.css",
//   "/icons/icon-192x192.png",
//   "/icons/icon-512x512.png",
//   "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
//   "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
//   "/dist/bundle.js",
// ];

// // install
// self.addEventListener("install", function (evt) {
//   // pre cache image data TODO: NOT SURE IF THIS SHOULD STAY FIXME:

//   //   evt.waitUntil(caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/images")));

//   // pre cache all static assets
//   evt.waitUntil(
//     caches
//       .open(STATIC_CACHE)
//       .then((cache) => cache.addAll(FILES_TO_CACHE))
//       .then(() => {
//         self.skipWaiting;
//       })
//   );

//   // tell the browser to activate this service worker immediately once it
//   // has finished installing
//   //   self.skipWaiting();
// });

// // activate
// // TODO: THIS NEEDS TO BE UPDATED FIXME:
// self.addEventListener("activate", function (evt) {
//   evt.waitUntil(
//     caches.keys().then((keyList) => {
//       return Promise.all(
//         keyList.map((key) => {
//           if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//             console.log("Removing old cache data", key);
//             return caches.delete(key);
//           }
//         })
//       );
//     })
//   );

//   self.clients.claim();
// });

// // fetch
// self.addEventListener("fetch", function (evt) {
//   if (evt.request.url.includes("/api/")) {
//     evt.respondWith(
//       caches
//         .open(DATA_CACHE_NAME)
//         .then((cache) => {
//           return fetch(evt.request)
//             .then((response) => {
//               // If the response was good, clone it and store it in the cache.
//               if (response.status === 200) {
//                 cache.put(evt.request.url, response.clone());
//               }

//               return response;
//             })
//             .catch((err) => {
//               // Network request failed, try to get it from the cache.
//               return cache.match(evt.request);
//             });
//         })
//         .catch((err) => console.log(err))
//     );

//     return;
//   }

//   evt.respondWith(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.match(evt.request).then((response) => {
//         return response || fetch(evt.request);
//       });
//     })
//   );
// });

//////////////////////////////////////////////////////////////////////////////////////////////

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/icons/icon-512x512.png",
  //   "/dist/bundle.js",
  "/manifest.webmanifest",
  //   "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.request).then((response) => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
