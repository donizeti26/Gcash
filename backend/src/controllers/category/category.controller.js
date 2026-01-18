import {
  registerCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "../../models/category/index.js";

export async function registerCategoryController(req, res) {
  const { name_category, color_selector, icon_selected, category_selected } =
    req.body;
  try {
    if (name_category && color_selector && icon_selected && category_selected) {
      const category = await registerCategory({
        name_category,
        color_selector,
        icon_selected,
        category_selected,
      });
      res.status(201).json(category);
    } else {
      res.status(400).json("Todas os Campos devem ser preenchidos:");
    }
  } catch (error) {
    console.error("Erro ao cadastrar categoria: ", error);
    res.status(500).json({ error: error.message });
  }
}

export async function getCategoriesController(req, res) {
  const { type } = req.query;
  try {
    const categories = await getCategories(type);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias: ", error);
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

export async function updateCategoryController(req, res) {
  try {
    console.log("REQ PARAMS:", req.params);
    console.log("REQ BODY:", req.body);

    const { category_id } = req.params;
    const { nameCategory, optionNewCategory, colorSelector, selectedIcon } =
      req.body;

    if (!category_id) {
      return res.status(400).json({ error: "category_id é obrigatório" });
    }

    await updateCategory(
      nameCategory,
      optionNewCategory,
      colorSelector,
      selectedIcon
    );

    return res.status(200).json({ message: "Atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar transação: ", err);
    res.status(500).json({ err: "Erro interno no servidor" });
  }
}
