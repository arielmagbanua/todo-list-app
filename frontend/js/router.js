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

  console.log(path);
  console.log(route);

  // if route is login hide the navigation bar
  if (path === "/login") {
    document.getElementById("navbar").style.display = "none";
  } else {
    document.getElementById("navbar").style.display = "flex";
  }

  // put inject the content in to the app div
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("app").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
