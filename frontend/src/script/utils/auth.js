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

export async function setNameUser() {
  const token = localStorage.getItem("token");

  const response = await apiFetch("/api/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data.user_name);
  const userName = document.getElementById("user_name");
  userName.textContent = `${data.user_name}`;
  console.log(userName);
}
