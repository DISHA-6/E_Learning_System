let courses = [];

// Renders course cards with optional category filtering
function renderCourses(filter = "all") {
  const courseList = document.getElementById("courseList");
  courseList.innerHTML = "";

  const filtered =
    filter === "all" ? courses : courses.filter((c) => c.category === filter);

  if (filtered.length === 0) {
    courseList.innerHTML =
      "<p class='text-muted'>No courses found in this category.</p>";
    return;
  }

  filtered.forEach((course) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${course.thumbnail}" class="card-img-top" alt="${course.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-primary">${course.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted text-capitalize">${course.category}</h6>
          <p class="card-text">${course.description}</p>
          <button class="btn btn-outline-primary mt-auto preview-btn" data-bs-toggle="modal" data-bs-target="#videoModal" data-video="${course.video}">
            Preview
          </button>
        </div>
      </div>
    `;

    courseList.appendChild(col);
  });

  attachPreviewEventListeners();
}

// Loads courses from JSON file
async function loadCourses(filter = "all") {
  try {
    const res = await fetch("../data/courses.json");
    courses = await res.json();
    renderCourses(filter);
  } catch (err) {
    console.error("Failed to load courses:", err);
  }
}

// Attaches click handlers to preview buttons
function attachPreviewEventListeners() {
  const buttons = document.querySelectorAll(".preview-btn");
  const videoFrame = document.getElementById("videoFrame");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const videoUrl = button.getAttribute("data-video");
      videoFrame.src = videoUrl;
    });
  });

  const videoModal = document.getElementById("videoModal");
  videoModal.addEventListener("hidden.bs.modal", () => {
    videoFrame.src = "";
  });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("categoryFilter");

  // Get category from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromURL = urlParams.get("category");

  if (categoryFromURL) {
    filterSelect.value = categoryFromURL;
    loadCourses(categoryFromURL); // Apply filter on load
  } else {
    loadCourses(); // No filter
  }

  // Dropdown filter listener
  filterSelect.addEventListener("change", (e) => {
    renderCourses(e.target.value);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    document.getElementById("userName").textContent = loggedInUser.name;
    document.getElementById("userRole").textContent = loggedInUser.role;
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/E_Learning_System/pages/login.html";
  });
});
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
