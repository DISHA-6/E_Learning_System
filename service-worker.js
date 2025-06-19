const CACHE_NAME = 'edusphere-cache-v1';
const urlsToCache = [
  '/pages/index.html',
  '/pages/top-rated.html',
  '/pages/courses.html',
  '/pages/home.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/manifest.json',
  '/data/courses.json',
  '/assets/images/course 1.jpg',
  '/assets/images/course 2.png',
  '/assets/images/course 3.png',
  '/assets/images/course 4.png',
  '/assets/images/course 5.png',
  '/assets/images/course 6.png',
  '/assets/images/course 7.png',
  '/assets/images/course 8.png',
  '/assets/images/course 9.png',
  '/assets/images/course 10.png',
  '/assets/images/course 11.png',
  '/assets/images/course 12.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});