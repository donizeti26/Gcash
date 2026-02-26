import pool from "../../config/db.js";

export async function countCategories(userId) {
  const query = `SELECT COUNT(*) AS total_categories FROM categories WHERE user_id=$1 `;
  const result = await pool.query(query, [userId]);
  return { total: Number(result.rows[0]?.total_categories) || 0 };
}

export async function countMoreFrequent(userId) {
  const query = `SELECT 
    c.name, 
    COUNT(*) AS total 
FROM transactions AS t 
INNER JOIN categories AS c 
    ON t.category_id = c.category_id 
WHERE 
    t.user_id = $1  
GROUP BY 
    c.category_id, c.name 
ORDER BY 
    total DESC 
LIMIT 1;`;
  const result = await pool.query(query, [userId]);
  return {
    name: result.rows[0]?.name ?? null,
    total: Number(result.rows[0]?.total) || 0,
  };
}
