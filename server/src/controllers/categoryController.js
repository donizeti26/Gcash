import {
  registerCatergory,
  getCategories,
  getExpenseCategories,
  getRevenueCategories,
} from "../models/categoryModel.js";

export async function registerCatergoryController(req, res) {
  const { name_categorie, color_selector, icon_selected, category_selected } =
    req.body;
  try {
    const category = await registerCatergory({
      name_categorie,
      color_selector,
      icon_selected,
      category_selected,
    });
    res.status(201).json(category);
  } catch (err) {
    console.error("Erro ao cadastrar categoria: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getCategoriesController(req, res) {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    console.error("Eeeo ao buscar categorias: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getExpenseCategoriesController(req, res) {
  try {
    const categories = await getExpenseCategories();
    res.json(categories);
  } catch (err) {
    console.error("Erro ao buscar categorias de despeas: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getRevenueCategoriesController(req, res) {
  try {
    const categories = await getRevenueCategories();
    res.json(categories);
  } catch (err) {
    console.error("Erro ao buscar categorias de receita", err);
    res.status(500).json({ error: err.message });
  }
}
