import { renderHome } from "./views/home.js";
import { renderLogin } from "./views/login.js";

function router() {
  const path = window.location.pathname;
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (path === "/login") {
    renderLogin();
  } else {
    renderHome();
  }
}

window.addEventListener("popstate", router);

// primeira carga
router();
