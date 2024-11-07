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
  "/todos/create": "/pages/create.html",
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

async function onPageChange(path) {
  // get the user id and token
  const userId = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

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
    // get the todos
    const url = `http://localhost:4000/api/todos/${userId}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const todos = data.map((todo) =>
          createTodoCard(todo._id, todo.title, todo.description)
        );

        document.getElementById("todos-container").innerHTML = todos.join("");

        // add event listeners to delete buttons
        document.querySelectorAll(".todo-delete").forEach((element) => {
          element.addEventListener("click", (event) => {
            // get the todo id from data attribute of delete button
            const todoId = event.target.dataset.id;

            // delete the todo via api
            const url = `http://localhost:4000/api/todos/${todoId}`;
            fetch(url, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Todo deleted:", data);
                window.location.replace("/todos");
              })
              .catch((error) => {
                console.error("Error deleting todo:", error);
              });
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }

  if (path === "/todos/create") {
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const form = document.getElementById("todoForm");

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const description = descriptionInput.value;

        // create a new todo via api
        const url = `http://localhost:4000/api/todos/${userId}`;
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Todo created:", data);
            window.location.replace("/todos");
          })
          .catch((error) => {
            console.error("Error creating todo:", error);
          });
      });
    }
  }
}

function createTodoCard(todoId, title, description) {
  return `
    <div class="todo-card">
    <div class="todo-header">
      <h3 class="todo-title">${title}</h3>
      <span class="todo-delete" data-id=${todoId}>x</span>
    </div>

    <p class="todo-content">${description}</p>
  </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  handleLocation();

  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();

    logoutUser();
  });
});
