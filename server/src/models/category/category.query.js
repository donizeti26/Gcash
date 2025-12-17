import pool from "../../config/db.js";

export async function getCategory(id) {
  const result = await pool.query(
    "SELECT * FROM categories WHERE category_id = $1",
    [id]
  );
  return result.rows[0];
}
