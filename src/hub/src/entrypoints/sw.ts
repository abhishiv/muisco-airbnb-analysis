declare var importScripts: any;
declare var workbox: any;

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.setConfig({ debug: true });

// Cache map tiles
// Cache for map tiles
workbox.routing.registerRoute(
  /^https:\/\/(?:maps\.wikimedia\.org\/osm-intl|api\.tiles\.mapbox\.com|[a-z]+\.tile\.openstreetmap\.org)\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "maps",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 500,
        maxAgeSeconds: 90 * 24 * 60 * 60, // 90 Days
        purgeOnQuotaError: true
      })
    ]
  })
);

export default {};
