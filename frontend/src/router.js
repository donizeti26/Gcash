import { renderHome } from "./views/home.js";
import { renderLogin } from "./views/login.js";
import { renderCreateAccount } from "./views/create_account.js";
import { isAuthenticated } from "./script/utils/auth.js";

const routes = {
  "/": { render: renderHome, private: true },
  "/login": { render: renderLogin, private: false },
  "/create_account": { render: renderCreateAccount, private: false },
};

function renderRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) {
    history.replaceState({}, "", "/login");
    return routes["/login"].render();
  }
  if (path === "/" && !isAuthenticated()) {
    history.replaceState({}, "", "/login");
    return routes["/login"].render();
  }
  route.render();
}

export function navigate(path) {
  history.pushState({}, "", path);
  renderRoute();
}
export function initRouter() {
  window.addEventListener("popstate", renderRoute);
  renderRoute();
}
