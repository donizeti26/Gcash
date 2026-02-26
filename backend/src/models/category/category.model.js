import pool from "../../config/db.js";

export async function registerCategory({
  name_category,
  color_selector,
  description,
  icon_selected,
  category_selected,
  userId,
}) {
  const result = await pool.query(
    "INSERT INTO categories(name, color, icon, type, description,user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING*",
    [
      name_category,
      color_selector,
      icon_selected,
      category_selected,
      description,
      userId,
    ],
  );
  return result.rows[0];
}

export async function updateCategory(
  nameCategory,
  optionNewCategory,
  colorSelector,
  selectedIcon,
  description,
  category_id,
  userId,
) {
  await pool.query(
    `UPDATE categories
      SET name = $1,
      type = $2,
      color = $3,
      icon=$4,
      description = $5
   WHERE category_id = $6 AND user_id = $7`,
    [
      nameCategory,
      optionNewCategory,
      colorSelector,
      selectedIcon,
      description,
      category_id,
      userId,
    ],
  );
  return { message: "Categoria atualizado" };
}

export async function getCategories(type, userId) {
  if (type == "all") {
    const result = await pool.query(
      `SELECT * FROM categories 
WHERE user_id = $1 
ORDER BY name;`,
      [userId],
    );
    return result.rows;
  }
  if (type) {
    const result = await pool.query(
      `SELECT * FROM categories 
WHERE type = $1 AND user_id = $2
ORDER BY name;`,
      [type, userId],
    );
    return result.rows;
  }
}

export async function deleteCategory(id, userId) {
  const query = "DELETE FROM categories WHERE category_id = $1 AND user_id=$2";
  const result = await pool.query(query, [id, userId]);
  return result.rowCount;
}
