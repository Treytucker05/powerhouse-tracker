let CACHE_NAME = "powerhouseatx-v2.0.0",
  STATIC_CACHE = "powerhouseatx-static-v2.0.0",
  DYNAMIC_CACHE = "powerhouseatx-dynamic-v2.0.0",
  STATIC_FILES = [
    "/",
    "/index.html",
    "/css/enhancedAdvanced.css",
    "/js/core/trainingState.js",
    "/js/core/db.js",
    "/js/algorithms/volume.js",
    "/js/algorithms/effort.js",
    "/js/algorithms/fatigue.js",
    "/js/algorithms/analytics.js",
    "/js/algorithms/exerciseSelection.js",
    "/js/algorithms/livePerformance.js",
    "/js/algorithms/intelligenceHub.js",
    "/js/algorithms/dataVisualization.js",
    "/js/algorithms/wellnessIntegration.js",
    "/js/algorithms/periodizationSystem.js",
    "/js/ui/feedbackFormUI.js",
    "/js/ui/globals.js",
    "/js/ui/enhancedAdvancedUI.js",
    "/js/ui/chartManager.js",
    "/js/utils/dataExport.js",
    "/js/utils/userFeedback.js",
    "/js/utils/performance.js",
    "/manifest.json",
    "/main.js",
    "/assets/favicon.ico",
  ],
  NETWORK_FIRST = ["/js/utils/userFeedback.js", "/js/utils/dataExport.js"],
  cacheableAssets = STATIC_FILES.filter((e) => {
    try {
      let t = new URL(e, self.location),
        s = t.origin === self.location.origin,
        n = t.pathname.startsWith("/test-");
      return s && !n;
    } catch (t) {
      return console.warn("Invalid URL in static assets:", e, t.message), !1;
    }
  }).filter((e) => !NETWORK_FIRST.includes(e));
self.addEventListener("install", (e) => {
  console.log("\uD83D\uDD27 Service Worker installing..."),
    e.waitUntil(
      (async () => {
        let e = await caches.open(STATIC_CACHE);
        for (let t of (console.log("\uD83D\uDCE6 Caching static files..."),
        cacheableAssets))
          try {
            await e.add(t), console.log("✓ Cached:", t);
          } catch (e) {
            console.warn("SW skip asset (cache fail):", t, e.message);
          }
        return (
          await caches.open(DYNAMIC_CACHE),
          console.log("\uD83D\uDD04 Dynamic cache initialized"),
          console.log("✅ Service Worker installation complete"),
          self.skipWaiting()
        );
      })(),
    );
}),
  self.addEventListener("activate", (e) => {
    console.log("\uD83D\uDE80 Service Worker activating..."),
      e.waitUntil(
        caches
          .keys()
          .then((e) =>
            Promise.all(
              e.map((e) => {
                if (e !== STATIC_CACHE && e !== DYNAMIC_CACHE)
                  return (
                    console.log("\uD83D\uDDD1️ Deleting old cache:", e),
                    caches.delete(e)
                  );
              }),
            ),
          )
          .then(
            () => (
              console.log("✅ Service Worker activation complete"),
              self.clients.claim()
            ),
          ),
      );
  });
let isCacheableRequest = (e) =>
  e.url.startsWith(self.location.origin) &&
  (e.url.startsWith("http://") || e.url.startsWith("https://"));
async function cacheFirst(e) {
  try {
    if (!isCacheableRequest(e)) return fetch(e);
    let t = await caches.match(e);
    if (t) return t;
    let s = await fetch(e);
    if (s.ok)
      try {
        let t = await caches.open(STATIC_CACHE);
        await t.put(e, s.clone());
      } catch (e) {
        console.warn("SW cache put failed:", e.message);
      }
    return s;
  } catch (e) {
    return (
      console.log(
        "\uD83D\uDCE1 Network failed, serving from cache or fallback:",
        e,
      ),
      (await caches.match("/index.html")) ||
        new Response("Offline", { status: 503 })
    );
  }
}
async function networkFirst(e) {
  try {
    let t = await fetch(e);
    if (t.ok)
      try {
        let s = await caches.open(DYNAMIC_CACHE);
        await s.put(e, t.clone());
      } catch (e) {
        console.warn("SW dynamic cache put failed:", e.message);
      }
    return t;
  } catch (t) {
    return (
      console.log("\uD83D\uDCE1 Network failed, serving from cache:", t),
      (await caches.match(e)) || new Response("Offline", { status: 503 })
    );
  }
}
async function staleWhileRevalidate(e) {
  let t = await caches.open(DYNAMIC_CACHE),
    s = await t.match(e),
    n = fetch(e)
      .then((s) => {
        if (s.ok)
          try {
            t.put(e, s.clone());
          } catch (e) {
            console.warn(
              "SW stale-while-revalidate cache put failed:",
              e.message,
            );
          }
        return s;
      })
      .catch((e) => (console.log("\uD83D\uDCE1 Network failed:", e), s));
  return s || (await n);
}
async function handleAnalyticsRequest(e) {
  let t = new URL(e.url);
  try {
    return await fetch(e);
  } catch (e) {
    return (
      t.pathname,
      Date.now(),
      new Response(JSON.stringify({ success: !0, offline: !0 }), {
        headers: { "Content-Type": "application/json" },
      })
    );
  }
}
async function syncTrainingData() {
  console.log("\uD83D\uDCCA Syncing training data...");
  try {
    let e = getPendingSessionData(),
      t = getPendingFeedbackData();
    for (let t of e) await syncSession(t);
    for (let e of t) await syncFeedback(e);
    console.log("✅ Training data sync complete");
  } catch (e) {
    console.error("❌ Training data sync failed:", e);
  }
}
async function syncFeedbackData() {
  console.log("\uD83D\uDCAC Syncing feedback data...");
  try {
    for (let e of getPendingUserFeedback()) await syncUserFeedback(e);
    console.log("✅ Feedback sync complete");
  } catch (e) {
    console.error("❌ Feedback sync failed:", e);
  }
}
function isStaticFile(e) {
  return (
    STATIC_FILES.some((t) => e.includes(t)) ||
    e.includes(".css") ||
    e.includes(".js") ||
    e.includes(".html")
  );
}
function isNetworkFirst(e) {
  return NETWORK_FIRST.some((t) => e.includes(t));
}
function isAnalyticsRequest(e) {
  return (
    e.includes("analytics") || e.includes("feedback") || e.includes("tracking")
  );
}
function getPendingSessionData() {
  return [];
}
function getPendingFeedbackData() {
  return [];
}
function getPendingUserFeedback() {
  return [];
}
async function syncSession(e) {
  console.log("\uD83D\uDD04 Syncing session:", e.id);
}
async function syncFeedback(e) {
  console.log("\uD83D\uDD04 Syncing feedback:", e.id);
}
async function syncUserFeedback(e) {
  console.log("\uD83D\uDD04 Syncing user feedback:", e.id);
}
function getCacheStatus() {
  return caches
    .keys()
    .then((e) => ({ caches: e, version: "powerhouseatx-v2.0.0" }));
}
async function clearAllCaches() {
  return Promise.all((await caches.keys()).map((e) => caches.delete(e)));
}
function scheduleTrainingReminder(e) {
  console.log(`\u{23F0} Training reminder scheduled for ${e} minutes`);
}
function registerBackgroundSync(e) {
  return self.registration.sync.register(e);
}
async function handleRequest(e) {
  try {
    return await fetch(e);
  } catch (t) {
    return (await caches.match(e)) || new Response("Offline", { status: 503 });
  }
}
self.addEventListener("fetch", (e) => {
  let { request: t } = e;
  isCacheableRequest(t) &&
    "GET" === t.method &&
    (isStaticFile(t.url)
      ? e.respondWith(cacheFirst(t))
      : isNetworkFirst(t.url)
        ? e.respondWith(networkFirst(t))
        : isAnalyticsRequest(t.url)
          ? e.respondWith(handleAnalyticsRequest(t))
          : e.respondWith(staleWhileRevalidate(t)));
}),
  self.addEventListener("sync", (e) => {
    console.log("\uD83D\uDD04 Background sync triggered:", e.tag),
      "background-sync-training-data" === e.tag
        ? e.waitUntil(syncTrainingData())
        : "background-sync-feedback" === e.tag &&
          e.waitUntil(syncFeedbackData());
  }),
  self.addEventListener("push", (e) => {
    console.log("\uD83D\uDCE2 Push notification received");
    let t = e.data ? e.data.json() : {},
      s = t.title || "PowerHouseATX",
      n = {
        body: t.body || "Time for your training session!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        image: t.image,
        data: t.data,
        actions: [
          {
            action: "start-session",
            title: "\uD83C\uDFCB️ Start Session",
            icon: "/icons/action-start.png",
          },
          {
            action: "postpone",
            title: "⏰ Postpone",
            icon: "/icons/action-postpone.png",
          },
        ],
        requireInteraction: !0,
        vibrate: [200, 100, 200],
      };
    e.waitUntil(self.registration.showNotification(s, n));
  }),
  self.addEventListener("notificationclick", (e) => {
    console.log("\uD83D\uDDB1️ Notification clicked:", e.action),
      e.notification.close();
    let t = e.action;
    e.notification.data,
      "start-session" === t
        ? e.waitUntil(clients.openWindow("/index.html#live-monitor"))
        : "postpone" === t
          ? scheduleTrainingReminder(30)
          : e.waitUntil(clients.openWindow("/index.html"));
  }),
  self.addEventListener("message", (e) => {
    let { type: t, data: s } = e.data;
    switch (t) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      case "GET_CACHE_STATUS":
        e.ports[0].postMessage({ cacheStatus: getCacheStatus() });
        break;
      case "CLEAR_CACHE":
        clearAllCaches().then(() => {
          e.ports[0].postMessage({ success: !0 });
        });
        break;
      case "SCHEDULE_REMINDER":
        scheduleTrainingReminder(s.minutes);
        break;
      case "REGISTER_BACKGROUND_SYNC":
        registerBackgroundSync(s.tag);
    }
  }),
  self.addEventListener("fetch", (e) => {
    let t = performance.now();
    e.respondWith(
      handleRequest(e.request).then((s) => {
        let n = performance.now() - t;
        return (
          n > 1e3 &&
            console.log(`\u{1F40C} Slow request: ${e.request.url} took ${n}ms`),
          s
        );
      }),
    );
  }),
  console.log("\uD83D\uDE80 PowerHouseATX Service Worker loaded");
//# sourceMappingURL=sw.js.map
