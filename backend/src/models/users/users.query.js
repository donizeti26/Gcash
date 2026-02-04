import pool from "../../config/db.js";

export async function getUserByEmail(email) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1 `, [
    email,
  ]);
  return result.rows;
}
