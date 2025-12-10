import {
  registerCategory,
  getCategories,
  getCategory,
  getExpenseCategories,
  getRevenueCategories,
} from "../models/categoryModel.js";

export async function registerCategoryController(req, res) {
  const { name_category, color_selector, icon_selected, category_selected } =
    req.body;
  try {
    const category = await registerCategory({
      name_category,
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
    console.error("Erro ao buscar categorias: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getSelectedCategoryController(req, res) {
  try {
    const { id } = req.params;
    const category = await getCategory(id);
    res.json(category);
  } catch (error) {
    console.error("Erro ao buscar a categoria: ", error);
    res.status(500).json({ error: error.message });
  }
}

export async function getExpenseCategoriesController(req, res) {
  try {
    const categories = await getExpenseCategories();
    res.json(categories);
  } catch (err) {
    console.error("Erro ao buscar categorias de despesas: ", err);
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
