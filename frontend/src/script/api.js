export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${process.env.production.API_URL}${endpoint}`, {
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
