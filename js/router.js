const routes = {
  '/': 'pages/index.html',
  '/login': 'pages/login.html',
  '/register': 'pages/register.html',
  '/home': 'pages/home.html'
};

function getCurrentRoute() {
  return location.hash.slice(1) || '/';
}

function toggleLayoutVisibility(route) {
  const hideOn = ['/login', '/register'];
  const nav = document.querySelector("nav");
  const footer = document.querySelector("footer");

  const show = !hideOn.includes(route);

  if (nav) nav.style.display = show ? 'flex' : 'none';
  if (footer) footer.style.display = show ? 'block' : 'none';
}

function loadPage(route) {
  const file = routes[route] || routes['/'];
  toggleLayoutVisibility(route);

  fetch(file)
    .then(res => res.text())
    .then(html => {
      const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      document.getElementById("app").innerHTML = match ? match[1] : html;

      // Re-execute any inline scripts in loaded page
      document.querySelectorAll("#app script").forEach(script => {
        const newScript = document.createElement("script");
        newScript.text = script.textContent;
        document.body.appendChild(newScript);
        newScript.remove();
      });
    })
    .catch(err => {
      document.getElementById("app").innerHTML = "<h2 style='color:white;'>Page not found</h2>";
      console.error("Routing error:", err);
    });
}

function handleRouting() {
  const route = getCurrentRoute();
  loadPage(route);
}

// Force default route on first load
if (!location.hash) {
  location.hash = '#/';
}

// Listen for hash changes and initial load
window.addEventListener("DOMContentLoaded", handleRouting);
window.addEventListener("hashchange", handleRouting);
