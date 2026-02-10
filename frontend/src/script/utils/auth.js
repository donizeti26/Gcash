export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
