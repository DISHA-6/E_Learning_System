var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = {};
    return (
      (g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2),
      }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };

let courses = [];

function renderCourses(filter = "all", searchTerm = "") {
  const courseList = document.getElementById("courseList");
  if (!courseList) return;

  courseList.innerHTML = "";

  let filtered =
    filter === "all" ? courses : courses.filter((c) => c.category === filter);

  if (searchTerm.trim() !== "") {
    filtered = filtered.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filtered.length === 0) {
    courseList.innerHTML =
      "<p class='text-muted'>No courses found matching the criteria.</p>";
    return;
  }

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.role === "admin";

  filtered.forEach((course, index) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${course.thumbnail}" class="card-img-top" alt="${
      course.title
    }">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-primary">${course.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted text-capitalize">${
            course.category
          }</h6>
          <p class="card-text">${course.description}</p>
          <button class="btn btn-outline-primary mt-auto preview-btn" data-bs-toggle="modal" data-bs-target="#videoModal" data-video="${
            course.video
          }">Preview</button>
          ${
            isAdmin
              ? `<div class="d-flex justify-content-between mt-2">
                  <button class="btn btn-sm btn-warning edit-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#addCourseModal">Edit</button>
                  <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
                </div>`
              : ""
          }
        </div>
      </div>
    `;
    courseList.appendChild(col);
  });

  attachPreviewEventListeners();
  attachAdminActionListeners();
}

function attachPreviewEventListeners() {
  const buttons = document.querySelectorAll(".preview-btn");
  const videoFrame = document.getElementById("videoFrame");
  if (!videoFrame) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const videoUrl = button.getAttribute("data-video");
      if (videoUrl) {
        videoFrame.src = videoUrl;
      }
    });
  });

  const videoModal = document.getElementById("videoModal");
  if (videoModal) {
    videoModal.addEventListener("hidden.bs.modal", () => {
      videoFrame.src = "";
    });
  }
}

function attachAdminActionListeners() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      const course = courses[index];
      document.getElementById("title").value = course.title;
      document.getElementById("category").value = course.category;
      document.getElementById("description").value = course.description;
      document.getElementById("video").value = course.video;
      document.getElementById("thumbnail").value = course.thumbnail;
      document.getElementById("courseForm").dataset.editIndex = index;
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      if (confirm("Are you sure you want to delete this course?")) {
        courses.splice(index, 1);
        localStorage.setItem("courses", JSON.stringify(courses));
        renderCourses();
      }
    });
  });
}

document.getElementById("courseForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const video = document.getElementById("video").value.trim();
  const thumbnail = document.getElementById("thumbnail").value.trim();

  const newCourse = { title, category, description, video, thumbnail };
  const indexToEdit = this.dataset.editIndex;

  if (indexToEdit !== undefined) {
    courses[parseInt(indexToEdit)] = newCourse;
    delete this.dataset.editIndex;
  } else {
    courses.push(newCourse);
  }

  localStorage.setItem("courses", JSON.stringify(courses));
  this.reset();
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addCourseModal")
  );
  modal.hide();
  renderCourses();
});

document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("categoryFilter");
  const searchInput = document.getElementById("searchInput");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.role === "admin";

  let currentFilter = "all";
  let currentSearchTerm = "";

  if (loggedInUser) {
    document.getElementById("userName").textContent = loggedInUser.name;
    document.getElementById("userRole").textContent = loggedInUser.role;
  }

  if (isAdmin) {
    document.getElementById("adminControls").style.display = "block";
  }

  // Handle URL filter from ?category=something
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");
  if (categoryFromUrl) {
    currentFilter = categoryFromUrl;
    const filterDropdown = document.getElementById("categoryFilter");
    if (filterDropdown) filterDropdown.value = categoryFromUrl;
  }

  fetch("/E_Learning_System/data/courses.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load courses.json");
      return res.json();
    })
    .then((fetchedCourses) => {
      const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
      const titles = new Set(storedCourses.map((c) => c.title));
      const merged = [
        ...storedCourses,
        ...fetchedCourses.filter((c) => !titles.has(c.title)),
      ];
      courses = merged;
      localStorage.setItem("courses", JSON.stringify(merged));
      renderCourses(currentFilter, currentSearchTerm);
    })
    .catch((err) => {
      console.error("Error loading courses.json:", err);
      courses = JSON.parse(localStorage.getItem("courses")) || [];
      renderCourses(currentFilter, currentSearchTerm);
    });

  filterSelect.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    renderCourses(currentFilter, currentSearchTerm);
  });

  searchInput.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value;
    renderCourses(currentFilter, currentSearchTerm);
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/E_Learning_System/pages/login.html";
  });
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}


