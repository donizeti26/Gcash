import pool from "../config/db.js";

export async function registerUser({ username, email, password }) {
  const result = await pool.query(
    "INSERT INTO users(name, email, password_hash, status) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hash]
  );
  return result.rows[0]; // retorna o usuário cadastrado
}
