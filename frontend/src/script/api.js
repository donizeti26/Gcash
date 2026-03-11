const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Erro na requisição");
  }

  return response.json();
}
