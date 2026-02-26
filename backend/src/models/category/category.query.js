import pool from "../../config/db.js";

export async function getCategory(id, userId) {
  const result = await pool.query(
    "SELECT * FROM categories WHERE category_id = $1 AND user_id=$2",
    [id, userId],
  );
  return result.rows[0];
}
