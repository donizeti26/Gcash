import pool from "../config/db.js";

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

export async function getCategories() {
  const result = await pool.query("SELECT * FROM categories");
  return result.rows;
}

export async function getExpenseCategories() {
  const result = await pool.query(
    "SELECT * FROM categories WHERE  type='expense'"
  );
  return result.rows;
}

export async function getRevenueCategories() {
  const result = await pool.query(
    "SELECT * FROM categories  WHERE  type='revenue'"
  );
  return result.rows;
}
