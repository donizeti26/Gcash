import pool from "../../config/db.js";

export async function registerCategory({
  name_category,
  color_selector,
  description,
  icon_selected,
  category_selected,
}) {
  const result = await pool.query(
    "INSERT INTO categories(name, color, icon, type, description) VALUES($1, $2, $3, $4, $5) RETURNING*",
    [
      name_category,
      color_selector,
      icon_selected,
      category_selected,
      description,
    ],
  );
  return result.rows[0];
}

export async function getCategories(type) {
  if (type == "all") {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    return result.rows;
  }
  if (type) {
    const result = await pool.query(
      "SELECT * FROM categories WHERE type=$1 ORDER BY name",
      [type],
    );
    return result.rows;
  }
}

export async function deleteCategory(id) {
  const query = "DELETE FROM categories WHERE category_id = $1";
  const result = await pool.query(query, [id]);
  return result.rowCount;
}

export async function updateCategory(
  nameCategory,
  optionNewCategory,
  colorSelector,
  selectedIcon,
  description,
  category_id,
) {
  await pool.query(
    `UPDATE categories
      SET name = $1,
      type = $2,
      color = $3,
      icon=$4,
      description = $5
   where category_id = $6`,
    [
      nameCategory,
      optionNewCategory,
      colorSelector,
      selectedIcon,
      description,
      category_id,
    ],
  );
  return { message: "Categoria atualizado" };
}
