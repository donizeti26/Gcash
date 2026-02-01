import { Router } from "express";

import {
  registerCategoryController,
  getCategoriesController,
  getSelectedCategoryController,
  deleteCategoryController,
  updateCategoryController,
  countController,
} from "../../controllers/category/index.js";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Criar categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso!
 *       500:
 *         description: Erro ao cadastrar categoria!
 */
router.post("/", registerCategoryController);

/**
 * @swagger
 * /api/categories/{category_id}:
 *   put:
 *     tags: [Category]
 *     summary: Atualizar todos os dados de uma categoria
 *     description: editando dados de uma categoria já existente
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID único da Categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                nameCategory:
 *                  type: string
 *                optionNewCategory:
 *                  type: string
 *                colorSelector:
 *                  type: string
 *                selectedIcon:
 *                  type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       500:
 *         description: Erro ao atualizar Categoria
 */
router.put("/:category_id", updateCategoryController);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar categorias
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [expense, revenue, all]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", getCategoriesController);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Buscar categoria por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro ao buscar categorias
 */
router.get("/category/:id", getSelectedCategoryController);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Remover categoria
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 */
router.delete("/:id", deleteCategoryController);

router.get("/reports/count/", countController);
export default router;
