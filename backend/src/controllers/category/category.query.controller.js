import {
  getCategory,
  countCategories,
  countMoreFrequent,
} from "../../models/category/index.js";

export async function getSelectedCategoryController(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const category = await getCategory(id, userId);

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao buscar a categoria: ", error);
    res.status(500).json({ error: error.message });
  }
}

export async function countController(req, res) {
  const { action } = req.query;

  if (action === "count") {
    return countCategoryController(req, res);
  } else if (action === "favorite") {
    return countMoreFrequentController(req, res);
  }
}

async function countCategoryController(req, res) {
  try {
    const userId = req.userId;
    const data = await countCategories(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao contar Categorias : ", error);
    return res.status(500).json({ error: error.message });
  }
}

async function countMoreFrequentController(req, res) {
  try {
    const userId = req.userId;
    const data = await countMoreFrequent(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao contar Categoria mais usada : ", error);
    return res.status(500).json({ error: error.message });
  }
}
