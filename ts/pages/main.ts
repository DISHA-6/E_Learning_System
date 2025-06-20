interface Course {
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  video: string;
}

let courses: Course[] = [];

// Renders course cards with optional category filtering
function renderCourses(filter: string = "all"): void {
  const courseList = document.getElementById("courseList") as HTMLElement | null;
  if (!courseList) return;

  courseList.innerHTML = "";

  const filtered: Course[] =
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
async function loadCourses(filter: string = "all"): Promise<void> {
  try {
    const res = await fetch("../data/courses.json");
    const data: Course[] = await res.json();
    courses = data;
    renderCourses(filter);
  } catch (err) {
    console.error("Failed to load courses:", err);
  }
}

// Attaches click handlers to preview buttons
function attachPreviewEventListeners(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".preview-btn");
  const videoFrame = document.getElementById("videoFrame") as HTMLIFrameElement | null;

  if (!videoFrame) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const videoUrl = button.getAttribute("data-video");
      if (videoUrl) videoFrame.src = videoUrl;
    });
  });

  const videoModal = document.getElementById("videoModal");
  if (videoModal) {
    videoModal.addEventListener("hidden.bs.modal", () => {
      videoFrame.src = "";
    });
  }
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("categoryFilter") as HTMLSelectElement | null;
  if (!filterSelect) return;

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
  filterSelect.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLSelectElement;
    renderCourses(target.value);
  });

  // Load logged in user info
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (loggedInUser) {
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");

    if (userName) userName.textContent = loggedInUser.name;
    if (userRole) userRole.textContent = loggedInUser.role;
  }

  //modification: Show "Add Course" button only if user is admin
  if (loggedInUser?.role === "admin") {
    const addBtnContainer = document.getElementById("addCourseBtnContainer");
    if (addBtnContainer) {
      addBtnContainer.style.display = "flex";
    }
  } else {
    const addBtnContainer = document.getElementById("addCourseBtnContainer");
    if (addBtnContainer) {
      addBtnContainer.style.display = "none";
    }
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/E_Learning_System/pages/login.html";
    });
  }

    //modification: new course addition
    // Course Form Handling (Admin Only)
    const courseForm = document.getElementById("courseForm") as HTMLFormElement | null;

    if (courseForm) {
      courseForm.addEventListener("submit", (e) => {
        e.preventDefault();
      
        const newCourse: Course = {
          title: (document.getElementById("courseTitle") as HTMLInputElement).value,
          category: (document.getElementById("courseCategory") as HTMLInputElement).value,
          description: (document.getElementById("courseDescription") as HTMLTextAreaElement).value,
          thumbnail: (document.getElementById("courseThumbnail") as HTMLInputElement).value,
          video: (document.getElementById("courseVideo") as HTMLInputElement).value,
        };
      
        courses.push(newCourse);
      
        // Optional: get currently selected filter value to re-render correctly
        const currentFilter = (document.getElementById("categoryFilter") as HTMLSelectElement)?.value || "all";
        renderCourses(currentFilter);
      
        courseForm.reset();
      
        const modalEl = document.getElementById("addCourseModal") as HTMLElement;
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      });
    }
}
);



function logout(): void {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
