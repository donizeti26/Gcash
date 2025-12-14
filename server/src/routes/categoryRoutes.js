import express from "express";

import {
  registerCategoryController,
  getCategoriesController,
  getSelectedCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", registerCategoryController);
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Criar categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_category
 *               - color_selector
 *               - icon_selected
 *               - category_selected
 *             properties:
 *               name_category:
 *                 type: string
 *               color_selector:
 *                 type: string
 *               icon_selected:
 *                 type: string
 *               category_selected:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria cadastrada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name_category:
 *                       type: string
 */

router.get("/", getCategoriesController);
/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Lista categorias com filtro opcional por tipo
 *     description: Retorna todas as categorias ou filtra por tipo (expense ou revenue)
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [expense, revenue]
 *           example: expense
 *         description: Tipo da categoria
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name_category:
 *                     type: string
 *                   color_selector:
 *                     type: string
 *                   icon_selected:
 *                     type: string
 *                   category_selected:
 *                     type: string
 *       400:
 *         description: Tipo de categoria inválido
 *       500:
 *         description: Erro interno do servidor
 */

router.get("/category/:id", getSelectedCategoryController);
/**
 * @swagger
 * /api/categories/category/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Busca categoria por ID
 *     description: Retorna uma categoria com o ID solicitado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name_category:
 *                   type: string
 *                 color_selector:
 *                   type: string
 *                 icon_selected:
 *                   type: string
 *                 category_selected:
 *                   type: string
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

router.delete("/categories/:id", deleteCategoryController);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Remove uma categoria
 *     description: Remove uma categoria pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria removida com sucesso
 */

export default router;
