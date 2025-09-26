// FitLife AI Service Worker
const CACHE_NAME = 'fitlife-ai-v1';
const API_CACHE_NAME = 'fitlife-api-v1';

// Files to cache for offline functionality
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// API endpoints that can be cached
const apiUrlsToCache = [
  '/api/user/profile'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('FitLife AI SW: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('FitLife AI SW: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('FitLife AI SW: Cache failed', error);
      })
  );
  
  // Force activate immediately
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('FitLife AI SW: Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('FitLife AI SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control immediately
  self.clients.claim();
});

// Fetch Handler - Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      // Network first strategy for API calls
      fetch(request)
        .then((response) => {
          // Only cache GET requests with successful responses
          if (request.method === 'GET' && response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for offline
          return caches.match(request);
        })
    );
    return;
  }
  
  // Handle app shell requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // No cache hit - fetch from network
        return fetch(request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('FitLife AI SW: Background sync event', event.tag);
  
  if (event.tag === 'sync-suggestions') {
    event.waitUntil(
      // Sync pending suggestion requests when back online
      syncPendingSuggestions()
    );
  }
});

// Handle push notifications (for future premium features)
self.addEventListener('push', (event) => {
  console.log('FitLife AI SW: Push event received');
  
  const options = {
    body: 'Nova sugestão de treino disponível!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'fitlife-notification',
    data: {
      url: '/dashboard'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver Sugestão',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  if (event.data) {
    const payload = event.data.json();
    options.body = payload.body || options.body;
    options.data.url = payload.url || options.data.url;
  }
  
  event.waitUntil(
    self.registration.showNotification('FitLife AI', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('FitLife AI SW: Notification click event');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Utility function for syncing pending suggestions
async function syncPendingSuggestions() {
  try {
    // Implementation for syncing offline suggestion requests
    console.log('FitLife AI SW: Syncing pending suggestions');
    
    // This would sync any queued suggestion requests made while offline
    // For now, just log that sync completed
    return Promise.resolve();
  } catch (error) {
    console.log('FitLife AI SW: Sync failed', error);
    throw error;
  }
}

// Handle message from main app
self.addEventListener('message', (event) => {
  console.log('FitLife AI SW: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});