self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open('pwa-cache-v1').then(cache=>{
      return cache.addAll([
          'index.html',
          'manifest.json',
          'css/styles.css',
          'assets/images/image.jpg',
          'assets/images/bg.jpg',
          'assets/images/course 1.jpg',
          'assets/images/course 2.jpg',
          'assets/images/course 3.jpg',
          'assets/images/course 4.jpg',
          'assets/images/course 5.jpg',
          'assets/images/course 6.jpg',
          'assets/images/course 7.jpg',
          'assets/images/course 8.jpg',
          'assets/images/course 9.jpg',
          'assets/images/course 10.jpg',
          'assets/images/course 11.jpg',
          'assets/images/course 12.jpg',
          'assets/images/course 13.jpg',
          'assets/images/course 14.jpg',
          'assets/images/course 15.jpg',
          'assets/images/login1.jpg',
          'js/main.js',
          'js/router.js',
          'data/courses.json',
          'pages/index.html',
          'pages/courses.html',
          'pages/home.html',
          'pages/login.html',
          'pages/register.html',
          'pages/dashboard.html',
          'pages/createCourse.html',
          'pages/topratedcourses.html',
          'assets/images/icons8-book-50.png'
      ]);
    }).catch(err=>{
      console.error('Cache addAll failed:',err);
    })
  );
});
self.addEventListener('fetch',event=>{
  event.respondWith(
    caches.match(event.request).then(response=>{
      return response || fetch(event.request).catch(()=>{
      if(event.request.mode==='navigate'){
        return caches.match('./pages/index.html');
      }
    });
   })
    );
});