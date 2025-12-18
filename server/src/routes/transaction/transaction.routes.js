import { Router } from "express";

import {
  createTransactionController,
  editTransactionsController,
  updateTransactionsController,
  updateStatusController,
  deleteTransactionsController,
} from "../../controllers/transaction/index.js";

import {
  getTransactionsController,
  consultCategoryController,
  consultStatusController,
} from "../../controllers/transaction/index.js";

import {
  reportsController,
  countTransactionsController,
} from "../../controllers/transaction/index.js";

const router = Router();

/* REPORTS - Relatórios */
router.get("/reports/", reportsController);
router.get("/reports/count/", countTransactionsController);

/* QUERIES - Consultas específicas */
router.get("/:transaction_id/status", consultStatusController);
router.get("/:transaction_id/category", consultCategoryController);
router.get("/:month/:year", getTransactionsController);

/* CRUD */
router.post("/", createTransactionController);
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Criar transação
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Erro ao cadastrar  transação
 */

router.get("/:transaction_id", editTransactionsController);
/**
 * @swagger
 * /api/transactions/{transaction_id}:
 *   get:
 *    tags: [Transaction]
 *    summary: Buscar transação pelo ID
 *    description: Retorna dados de uma transação para modal de edição
 *    parameters:
 *      - in: path
 *        name: transaction_id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID único da transação
 *    responses:
 *      200:
 *        description: Transação encontrada com sucesso
 *      400:
 *        description: ID da transação não informado
 *      404:
 *        description: Transação não encontrada
 *
 */

router.put("/:transaction_id", updateTransactionsController);
/**
 * @swagger
 * /api/transactions/{transaction_id}:
 *   put:
 *     tags: [Transaction]
 *     summary: Atualizar todos os dados de uma transação
 *     description: editando dados de uma transação já existente
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                amount:
 *                  type: number
 *                description:
 *                  type: string
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       500:
 *         description: Erro ao atualizar transação
 */
router.patch("/:transaction_id/statusUpdate", updateStatusController);

/**
 * @swagger
 * /api/transactions/{transaction_id}/statusUpdate:
 *   patch:
 *     tags: [Transaction]
 *     summary: Atualizar o status da transação
 *     description: Atualizar o status da transação pelo ID
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: approved
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       500:
 *         description: Erro ao alterar status
 */

router.delete("/:transaction_id", deleteTransactionsController);

/**
 * @swagger
 * /api/transaction/{transaction_id}:
 *   delete:
 *     tags: [Transaction]
 *     summary: Remove uma transação
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transação removida com sucesso
 *       500:
 *         description: Erro ao apagar transação
 */

export default router;
