import pool from "../../config/db.js";

export async function createUser({
  user_name,
  first_name,
  last_name,
  email,
  password_hash,
  status,
}) {
  await pool.query(
    `INSERT INTO users (user_name, first_name, last_name, email, password_hash, status)
VALUES ($1,$2,$3,$4,$5,$6)`,
    [user_name, first_name, last_name, email, password_hash, status],
  );
}
