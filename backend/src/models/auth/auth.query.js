import pool from "../../config/db.js";

export async function getUserByEmail(email) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1 `, [
    email,
  ]);
  return result.rows;
}
export async function findUserById(id) {
  const result = await pool.query(
    "SELECT user_id, user_name, email FROM users WHERE user_id = $1",
    [id],
  );

  return result.rows[0];
}
