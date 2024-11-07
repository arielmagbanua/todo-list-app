// route to the page
const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

// list of route paths
const routes = {
  404: "/pages/404.html",
  "/": "/pages/todos.html",
  "/todos": "/pages/todos.html",
  "/login": "/pages/login.html",
};

// handle route change
const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];

  if (path === "/" || path === "/todos") {
    // get the user id and token
    const userId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");

    if (!userId || !token) {
      // not yet logged in so redirect to login screen
      window.location.replace("/login");
    }

    return;
  }

  // if route is login hide the navigation bar
  if (path === "/login") {
    document.getElementById("navbar").style.display = "none";
  } else {
    document.getElementById("navbar").style.display = "flex";
  }

  // put inject the content in to the app div
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("app").innerHTML = html;

  onPageChange(path);
};

window.onpopstate = handleLocation;
window.route = route;

function logoutUser() {
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("token");

  window.location.replace("/login");
}

function loginUser(email, password) {
  // attempt authentication to server via fetch API
  const AUTH_URL = "http://localhost:4000/api/users/auth";
  fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        sessionStorage.setItem("token", data.token); // Save token to localStorage
        sessionStorage.setItem("user_id", data.user_id);
        console.log("Logged in successfully");

        // redirect the user to the todos
        window.location.replace("/todos");
      } else {
        console.error("Login failed:", data.message);
      }
      return data;
    });
}

function onPageChange(path) {
  if (path === "/login") {
    // refresh the listeners for form
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const form = document.getElementById("loginForm");

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        loginUser(emailInput.value, passwordInput.value);
      });
    }

    return;
  }

  if (path === "/" || path === "/todos") {
    // get the user id and token
    const userId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleLocation();

  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();

    logoutUser();
  });
});
