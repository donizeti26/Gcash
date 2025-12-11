import {
  registerCategory,
  getCategories,
  getCategory,
  getExpenseCategories,
  getRevenueCategories,
  deleteCategory,
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
    console.error("Erro ao cadastrar categoria: ", error);
    res.status(500).json({ error: error.message });
  }
}

export async function getCategoriesController(req, res) {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    console.error("Erro ao buscar categorias: ", error);
    res.status(500).json({ error: error.message });
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
    console.error("Erro ao buscar categorias de despesas: ", error);
    res.status(500).json({ error: error.message });
  }
}

export async function getRevenueCategoriesController(req, res) {
  try {
    const categories = await getRevenueCategories();
    res.json(categories);
  } catch (err) {
    console.error("Erro ao buscar categorias de receita", error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCategoryController(req, res) {
  try {
    const { id } = req.params;
    const deletedCategoryVar = await deleteCategory(id);
    if (deletedCategoryVar === 0) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }
    res.json({ message: "Categoria apagada com sucesso!" });
  } catch (error) {
    console.error("Erro ao apagar a categoria", error);
    res.status(500).json({ error: err.message });
  }
}
