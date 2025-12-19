import pool from "../../config/db.js";

export async function registerCategory({
  name_category,
  color_selector,
  icon_selected,
  category_selected,
}) {
  const result = await pool.query(
    "INSERT INTO categories(name, color, icon, type) VALUES($1, $2, $3, $4) RETURNING*",
    [name_category, color_selector, icon_selected, category_selected]
  );
  return result.rows[0];
}

export async function getCategories(type) {
  if (type) {
    const result = await pool.query(
      "SELECT * FROM categories WHERE type=$1 ORDER BY name",
      [type]
    );
    return result.rows;
  }
  const result = await pool.query("SELECT * FROM categories ORDER BY name");
  return result.rows;
}

export async function deleteCategory(id) {
  const query = "DELETE FROM categories WHERE category_id = $1";
  const result = await pool.query(query, [id]);
  return result.rowCount;
}
