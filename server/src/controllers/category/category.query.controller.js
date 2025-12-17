import { getCategory } from "../../models/category/index.js";

export async function getSelectedCategoryController(req, res) {
  try {
    const { id } = req.params;
    const category = await getCategory(id);

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    return res.json(category);
  } catch (error) {
    console.error("Erro ao buscar a categoria: ", error);
    res.status(500).json({ error: error.message });
  }
}
