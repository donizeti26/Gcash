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
 * /api/transaction:
 *   post:
 *     summary: Criar transação
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - payment_method_id
 *               - due_date
 *               - amount
 *               - description
 *               - status
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 26
 *               payment_method_id:
 *                 type: string
 *                 example: 5
 *               due_date:
 *                 type: date
 *                 example: 26/12/2025
 *               amount:
 *                 type: integer
 *                 example: 500.00
 *               description:
 *                 type: string
 *                 example: Viagem ao litoral
 *               status:
 *                 type: string
 *                 enum: [paid, pending]
 *                 example: paid
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transação cadastrada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: integer
 *                       example: 26
 *                     payment_method_id:
 *                       type: string
 *                       example: 2
 *                     due_date:
 *                       type: date
 *                       example: 26/12/2025
 *                     amount:
 *                       type: integer
 *                       example: 250.00
 *                     description:
 *                       type: string
 *                       example:  Café da manhã
 *                     status:
 *                       type: string
 *                       enum: [paid, pending]
 *                       example: paid
 *       500:
 *         description: Erro ao cadastrar  transação
 */

router.get("/:transaction_id", editTransactionsController);
router.put("/:transaction_id", updateTransactionsController);
/**
 * @swagger
 * /api/transactions/{transaction_id}
 *   patch:
 *     tags: [Transaction]
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
 *     description: Remove uma categoria pelo ID
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
