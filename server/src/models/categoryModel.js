const pool = require("../config/db");

async function registerCatergory({
  name_categorie,
  color_selector,
  icon_selected,
  category_selected,
}) {
  const result = await pool.query(
    "INSERT INTO categories(name, color, icon, type) VALUES($1, $2, $3, $4) RETURNING*",
    [name_categorie, color_selector, icon_selected, category_selected]
  );
  return result.rows[0];
}

async function getCategories() {
  const result = await pool.query("SELECT * FROM categories");
  return result.rows;
}

async function getExpenseCategories() {
  const result = await pool.query(
    "SELECT * FROM categories WHERE  type='expense'"
  );
  return result.rows;
}

async function getRevenueCategories() {
  const result = await pool.query("SELECT * FROM categories");
  return result.rows;
}

module.exports = {
  registerCatergory,
  getCategories,
  getExpenseCategories,
  getRevenueCategories,
};
