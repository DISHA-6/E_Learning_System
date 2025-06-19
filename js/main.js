function setupPage(pageName) {
  console.log("🔥 setupPage triggered:", pageName);
  if (pageName === 'login') setupLogin();
  if (pageName === 'register') setupRegister();
  if (pageName === 'home') setupHome();
  if (pageName === 'courses') setupCourses();
  if (pageName === 'topratedcourse') setupTopRated();
}

// LOGIN
function setupLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("loginError");

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
      error.textContent = "Please enter a valid email address.";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (validUser) {
      alert("Login successful!");
      localStorage.setItem("loggedInUser", JSON.stringify(validUser));
      location.hash = "home";
    } else {
      error.textContent = "Invalid credentials. Please try again or register....";
    }
  });
}

// REGISTER
function setupRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = document.getElementById("role").value;
    const error = document.getElementById("registerError");

    const emailPattern = /^[^@\s]+@[^@\s]+\.com$/i;
    if (!emailPattern.test(email)) {
      error.textContent = "❌ Please enter a valid email";
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      error.textContent = "❌ Password must be 8+ chars, with uppercase, lowercase, number & special character.";
      return;
    }

    if (password !== confirmPassword) {
      error.textContent = "❌ Passwords do not match.";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((user) => user.email === email)) {
      error.textContent = "⚠️ User with this email already exists.";
      return;
    }

    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Registration successful!");
    location.hash = "login";
  });
}

// COURSES
function setupCourses() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // ✅ Load courses from localStorage
  let courses = JSON.parse(localStorage.getItem("courses"));

  // 📦 If not present in localStorage, load from JSON once and save to localStorage
  if (!courses) {
    fetch("/E_Learning_System/data/courses.json")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("courses", JSON.stringify(data));
        renderCourses(data, user?.role);
      })
      .catch((err) =>
        console.error("❌ Failed to load courses.json:", err)
      );
  } else {
    renderCourses(courses, user?.role);
  }

  // ✅ Show admin controls if admin
  const adminControls = document.getElementById("adminControls");
  if (adminControls) {
    adminControls.style.display = user?.role === "admin" ? "block" : "none";
  }
}




function renderCourseCard(course, index, role) {
  const isAdmin = role === "admin";
  const thumbnailPath = course.thumbnail.startsWith("../")
    ? course.thumbnail.replace("..", "/E_Learning_System")
    : course.thumbnail;

  return `
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${thumbnailPath}" class="card-img-top" alt="${course.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-primary">${course.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted text-capitalize">${course.category}</h6>
          <p class="card-text">${course.description}</p>
          
          <div class="mt-auto d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-info text-white preview-btn" data-bs-toggle="modal" data-bs-target="#videoModal" data-video="${course.video}">
              <i class="bi bi-play-circle"></i> Preview
            </button>
            <button class="btn btn-sm btn-secondary review-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#reviewModal">
              <i class="bi bi-chat-dots"></i> Reviews
            </button>

            ${isAdmin ? `
              <button class="btn btn-sm btn-warning edit-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#addCourseModal">
                <i class="bi bi-pencil-square"></i> Edit
              </button>
              <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
                <i class="bi bi-trash"></i> Delete
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCourses(courseArray) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const role = user?.role || "user";
  const container = document.getElementById("courseList");
  container.innerHTML = "";

  courseArray.forEach((course, index) => {
    container.innerHTML += renderCourseCard(course, index, role);
  });

  // ✅ Important: attach event listeners to new buttons
  addCourseEventListeners(courseArray);
}


function setupCourses() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let courses = JSON.parse(localStorage.getItem("courses"));

  if (!courses) {
    fetch("/E_Learning_System/data/courses.json")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("courses", JSON.stringify(data));
        renderCourses(data, user?.role);
        setupCourseActions(); // ✅ Add this line
      })
      .catch((err) =>
        console.error("❌ Failed to load courses.json:", err)
      );
  } else {
    renderCourses(courses, user?.role);
    setupCourseActions(); // ✅ Add this line
  }

  const adminControls = document.getElementById("adminControls");
  if (adminControls) {
    adminControls.style.display = user?.role === "admin" ? "block" : "none";
  }
}
function setupCourseActions() {

}





// SUPPORT FUNCTIONS
function previewVideo(videoUrl) {
  const frame = document.getElementById("videoFrame");
  if (frame) {
    frame.src = videoUrl;
    new bootstrap.Modal(document.getElementById("videoModal")).show();
  }
}


function openReviewModal(index) {
  fetch("/E_Learning_System/data/courses.json")
    .then(res => res.json())
    .then(courses => {
      const course = courses[index];
      document.getElementById("reviewCourseTitle").textContent = course.title;
      document.getElementById("reviewContent").textContent = `This course has a rating of ${course.reviews} stars.`;
    });
}


function editCourse(index) {
  fetch("/E_Learning_System/data/courses.json")
    .then(res => res.json())
    .then(courses => {
      const course = courses[index];
      if (!course) return alert("Course not found.");

      // Fill modal fields
      document.getElementById("courseIndex").value = index;
      document.getElementById("courseTitle").value = course.title;
      document.getElementById("courseCategory").value = course.category;
      document.getElementById("courseDescription").value = course.description;
      document.getElementById("courseVideo").value = course.video;
      document.getElementById("courseThumbnail").value = course.thumbnail;
      document.getElementById("courseReviews").value = course.reviews;
    });
}


function deleteCourse(index) {
  fetch("/E_Learning_System/data/courses.json")
    .then(res => res.json())
    .then(courses => {
      if (confirm("❌ Are you sure you want to delete this course?")) {
        courses.splice(index, 1);
        renderCourses(courses);
      }
    });
}


// HOME + TOP RATED
function setupHome() {
  console.log("🏠 Home page loaded.");
}

function setupTopRated() {
  const carouselContainer = document.getElementById("carouselContent");
  if (!carouselContainer) return;

  fetch("/E_Learning_System/data/courses.json")
    .then(res => res.json())
    .then(courses => {
      const topRated = courses.filter(course => course.reviews >= 4);
      const cardsPerSlide = 3;
      const slides = [];

      function getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        let stars = "";
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star text-warning"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star text-warning"></i>';
        return `<div class="mb-2">${stars}</div>`;
      }

      for (let i = 0; i < topRated.length; i += cardsPerSlide) {
        const batch = topRated.slice(i, i + cardsPerSlide);
        const cards = batch.map(course => `
          <div class="card" style="width: 18rem;">
            <img src="${course.thumbnail.replace("..", "/E_Learning_System")}" class="card-img-top" alt="${course.title}" />
            <div class="card-body text-center">
              <h5 class="card-title">${course.title}</h5>
              ${getStarsHTML(course.reviews)}
              <p class="text-light">${course.reviews} stars</p>
              <p class="card-text">${course.description}</p>
              <button class="btn enroll-btn">Enroll</button>
            </div>
          </div>
        `).join("");

        slides.push(`
          <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <div class="d-flex justify-content-center gap-4 flex-wrap">
              ${cards}
            </div>
          </div>
        `);
      }

      carouselContainer.innerHTML = slides.join("");
    })
    .catch(err => {
      console.error("❌ Failed to load top-rated courses:", err);
      carouselContainer.innerHTML = "<p class='text-danger text-center'>Failed to load courses.</p>";
    });
}



function renderTopRatedCourses(courses) {
  const container = document.getElementById("topRatedCarousel");
  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = "<p class='text-center'>No top rated courses found.</p>";
    return;
  }

  let carouselInner = "";
  courses.forEach((course, index) => {
    const isActive = index === 0 ? "active" : "";
    const thumbnailPath = course.thumbnail.startsWith("../")
      ? course.thumbnail.replace("..", "/E_Learning_System")
      : course.thumbnail;

    carouselInner += `
      <div class="carousel-item ${isActive}">
        <div class="text-center">
          <img src="${thumbnailPath}" class="d-block mx-auto" style="max-height: 300px;">
          <div class="mt-3">
            <h4>${course.title}</h4>
            <p>${course.description}</p>
            <p class="text-warning"><i class="bi bi-star-fill"></i> ${course.reviews}</p>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">${carouselInner}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  `;
}

function addCourseEventListeners(courses) {
  document.querySelectorAll(".preview-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const video = btn.getAttribute("data-video");
      previewVideo(video);
    });
  });

  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = btn.getAttribute("data-index");
      openReviewModal(index);
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = btn.getAttribute("data-index");
      editCourse(index);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = btn.getAttribute("data-index");
      deleteCourse(index);
    });
  });
}



function logout() {
  localStorage.removeItem("loggedInUser");
  location.hash = "login"; // go to login page without reload
}




