import pool from "../../config/db.js";

export async function countCategories() {
  const query = `SELECT COUNT(*) AS total_categories FROM categories `;
  const result = await pool.query(query);
  return { total: Number(result.rows[0]?.total_categories) || 0 };
}

export async function countMoreFrequent() {
  const query = `SELECT c.name, COUNT(*) AS total FROM transactions AS t INNER JOIN
categories AS c ON t.category_id = c.category_id
GROUP BY c.name
ORDER BY total DESC
LIMIT 1;`;
  const result = await pool.query(query);
  return {
    name: result.rows[0]?.name ?? null,
    total: Number(result.rows[0]?.total) || 0,
  };
}
