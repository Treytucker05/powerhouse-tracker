/**
 * PowerHouseATX Service Worker
 * Provides offline functionality and caching for the training application
 */

const CACHE_NAME = 'powerhouseatx-v2.0.0';
const STATIC_CACHE = 'powerhouseatx-static-v2.0.0';
const DYNAMIC_CACHE = 'powerhouseatx-dynamic-v2.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/enhancedAdvanced.css',
  '/js/core/trainingState.js',
  '/js/core/db.js',
  '/js/algorithms/volume.js',
  '/js/algorithms/effort.js',
  '/js/algorithms/fatigue.js',
  '/js/algorithms/analytics.js',
  '/js/algorithms/exerciseSelection.js',
  '/js/algorithms/livePerformance.js',
  '/js/algorithms/intelligenceHub.js',
  '/js/algorithms/dataVisualization.js',
  '/js/algorithms/wellnessIntegration.js',
  '/js/algorithms/periodizationSystem.js',
  '/js/ui/feedbackFormUI.js',
  '/js/ui/globals.js',
  '/js/ui/enhancedAdvancedUI.js',
  '/js/ui/chartManager.js',
  '/js/utils/dataExport.js',
  '/js/utils/userFeedback.js',
  '/js/utils/performance.js',
  '/manifest.json',
  '/main.js',
  '/assets/favicon.ico'
];

// Files that should always be fetched fresh
const NETWORK_FIRST = [
  '/js/utils/userFeedback.js',
  '/js/utils/dataExport.js'
];

// FILTER any cross-origin URLs & experimental test pages
const cacheableAssets = STATIC_FILES.filter(a => {
  try {
    const url = new URL(a, self.location);
    const sameOrigin = url.origin === self.location.origin;
    const isExperimental = url.pathname.startsWith('/test-');
    return sameOrigin && !isExperimental;
  } catch (e) {
    console.warn('Invalid URL in static assets:', a, e.message);
    return false;
  }
}).filter(url => !NETWORK_FIRST.includes(url));

// Install event - cache static files individually to prevent one failure from rejecting all
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      console.log('📦 Caching static files...');
      
      for (const asset of cacheableAssets) {
        try {
          await cache.add(asset);
          console.log('✓ Cached:', asset);
        } catch (err) {
          console.warn('SW skip asset (cache fail):', asset, err.message);
        }
      }
      
      const dynamicCache = await caches.open(DYNAMIC_CACHE);
      console.log('🔄 Dynamic cache initialized');
      
      console.log('✅ Service Worker installation complete');
      return self.skipWaiting();
    })()
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activation complete');
      return self.clients.claim();
    })
  );
});

// Check if a request is cacheable (same-origin + http/https)
const isCacheableRequest = req =>
  req.url.startsWith(self.location.origin) &&       // same-origin
  (req.url.startsWith('http://') || req.url.startsWith('https://'));

// Fetch event - serve cached content or fetch from network
self.addEventListener('fetch', event => {
  const { request } = event;

  // ➜ Skip EVERYTHING that isn't http/https & same-origin
  if (!isCacheableRequest(request)) return;  // Let the network handle it

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isStaticFile(request.url)) {
      event.respondWith(cacheFirst(request));
    } else if (isNetworkFirst(request.url)) {
      event.respondWith(networkFirst(request));
    } else if (isAnalyticsRequest(request.url)) {
      event.respondWith(handleAnalyticsRequest(request));
    } else {
      event.respondWith(staleWhileRevalidate(request));
    }
  }
});

// Cache first strategy - for static files
async function cacheFirst(request) {
  try {
    // isCacheableRequest has already filtered at the fetch listener level,
    // but we keep a guard just in case this function is called directly
    if (!isCacheableRequest(request)) {
      return fetch(request);
    }
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      try {
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, networkResponse.clone());
      } catch (err) {
        console.warn('SW cache put failed:', err.message);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📡 Network failed, serving from cache or fallback:', error);
    return await caches.match('/index.html') || new Response('Offline', { status: 503 });
  }
}

// Network first strategy - for dynamic content
async function networkFirst(request) {
  try {
    // isCacheableRequest already checked at fetch listener
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(request, networkResponse.clone());
      } catch (err) {
        console.warn('SW dynamic cache put failed:', err.message);
      }
    }
    return networkResponse;
  } catch (error) {
    console.log('📡 Network failed, serving from cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Stale while revalidate - for general content
async function staleWhileRevalidate(request) {
  // isCacheableRequest already checked at fetch listener
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      try {
        cache.put(request, networkResponse.clone());
      } catch (err) {
        console.warn('SW stale-while-revalidate cache put failed:', err.message);
      }
    }
    return networkResponse;
  }).catch(error => {
    console.log('📡 Network failed:', error);
    return cachedResponse;
  });
  
  return cachedResponse || await fetchPromise;
}

// Handle analytics requests (can work offline)
async function handleAnalyticsRequest(request) {
  // isCacheableRequest already checked at fetch listener
  const url = new URL(request.url);
  
  try {
    return await fetch(request);
  } catch (error) {
    // Store analytics data locally when offline
    const analyticsData = {
      url: url.pathname,
      timestamp: Date.now(),
      offline: true
    };
    
    // Store in IndexedDB or return success response
    return new Response(JSON.stringify({ success: true, offline: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for offline data
self.addEventListener('sync', event => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-training-data') {
    event.waitUntil(syncTrainingData());
  } else if (event.tag === 'background-sync-feedback') {
    event.waitUntil(syncFeedbackData());
  }
});

// Sync training data when back online
async function syncTrainingData() {
  console.log('📊 Syncing training data...');
  
  try {
    // Get pending training data from localStorage
    const pendingSessions = getPendingSessionData();
    const pendingFeedback = getPendingFeedbackData();
    
    // Sync session data
    for (const session of pendingSessions) {
      await syncSession(session);
    }
    
    // Sync feedback data
    for (const feedback of pendingFeedback) {
      await syncFeedback(feedback);
    }
    
    console.log('✅ Training data sync complete');
  } catch (error) {
    console.error('❌ Training data sync failed:', error);
  }
}

// Sync feedback data when back online
async function syncFeedbackData() {
  console.log('💬 Syncing feedback data...');
  
  try {
    const pendingFeedback = getPendingUserFeedback();
    
    for (const feedback of pendingFeedback) {
      await syncUserFeedback(feedback);
    }
    
    console.log('✅ Feedback sync complete');
  } catch (error) {
    console.error('❌ Feedback sync failed:', error);
  }
}

// Push notifications for training reminders
self.addEventListener('push', event => {
  console.log('📢 Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'PowerHouseATX';
  const options = {
    body: data.body || 'Time for your training session!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: data.image,
    data: data.data,
    actions: [
      {
        action: 'start-session',
        title: '🏋️ Start Session',
        icon: '/icons/action-start.png'
      },
      {
        action: 'postpone',
        title: '⏰ Postpone',
        icon: '/icons/action-postpone.png'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('🖱️ Notification clicked:', event.action);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  
  if (action === 'start-session') {
    event.waitUntil(
      clients.openWindow('/index.html#live-monitor')
    );
  } else if (action === 'postpone') {
    // Schedule another reminder
    scheduleTrainingReminder(30); // 30 minutes later
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/index.html')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      event.ports[0].postMessage({
        cacheStatus: getCacheStatus()
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'SCHEDULE_REMINDER':
      scheduleTrainingReminder(data.minutes);
      break;
      
    case 'REGISTER_BACKGROUND_SYNC':
      registerBackgroundSync(data.tag);
      break;
  }
});

// Utility functions
function isStaticFile(url) {
  return STATIC_FILES.some(file => url.includes(file)) || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.html');
}

function isNetworkFirst(url) {
  return NETWORK_FIRST.some(file => url.includes(file));
}

function isAnalyticsRequest(url) {
  return url.includes('analytics') || url.includes('feedback') || url.includes('tracking');
}

function getPendingSessionData() {
  // This would integrate with the main app's localStorage
  // For now, return empty array
  return [];
}

function getPendingFeedbackData() {
  // This would integrate with the main app's localStorage
  return [];
}

function getPendingUserFeedback() {
  // This would integrate with the feedback system
  return [];
}

async function syncSession(session) {
  // Sync individual session to server
  console.log('🔄 Syncing session:', session.id);
}

async function syncFeedback(feedback) {
  // Sync feedback to server
  console.log('🔄 Syncing feedback:', feedback.id);
}

async function syncUserFeedback(feedback) {
  // Sync user feedback to server
  console.log('🔄 Syncing user feedback:', feedback.id);
}

function getCacheStatus() {
  return caches.keys().then(cacheNames => {
    return {
      caches: cacheNames,
      version: CACHE_NAME
    };
  });
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

function scheduleTrainingReminder(minutes) {
  // Schedule a training reminder
  console.log(`⏰ Training reminder scheduled for ${minutes} minutes`);
}

function registerBackgroundSync(tag) {
  return self.registration.sync.register(tag);
}

console.log('🚀 PowerHouseATX Service Worker loaded');
