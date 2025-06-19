console.log("🚀 router.js loaded");

const routes = {
  index: '/pages/index.html',
  login: '/pages/login.html',
  register: '/pages/register.html',
  home: '/pages/home.html',
  courses: '/pages/courses.html',
  topratedcourse: '/pages/topratedcourse.html',
  createcourse: '/pages/createCourse.html',
  dashboard: '/pages/dashboard.html'
};

function loadPage(pageName) {
  const path = routes[pageName] || routes.index;
  console.log("Loading page:", pageName);

  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${path}`);
      return res.text();
    })
    .then(html => {
      document.getElementById('app').innerHTML = html;
      console.log(`✅ Page ${pageName} loaded`);
      if (typeof setupPage === 'function') {
        setupPage(pageName);
      }
    })
    .catch(err => {
      console.error(`❌ Error loading ${pageName}:`, err);
    });
}

function initRouter() {
  const page = location.hash.replace('#', '') || 'index';
  loadPage(page);

  window.addEventListener('hashchange', () => {
    const newPage = location.hash.replace('#', '') || 'index';
    loadPage(newPage);
  });
}

initRouter();
