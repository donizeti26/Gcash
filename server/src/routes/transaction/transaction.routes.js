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
/**
 * @swagger
 * /api/reports:
 *   get:
 *     tags: [Reports]
 *     summary: Gerar relatório
 *     description: Gera relatório filtrado por mês, ano e tipo
 *     parameters:
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 6
 *         description: Mês do relatório (1 a 12)
 *
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 2000
 *         example: 2025
 *         description: Ano do relatório
 *
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [expense, revenue]
 *         example: expense
 *         description: Tipo do relatório
 *
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       400:
 *         description: Parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/reports/count/", countTransactionsController);
/**
 * @swagger
 * /api/transactions/reports/count:
 *   get:
 *     tags: [Reports]
 *     summary: Gerar relatório
 *     description: Calcula a quantidade de transações existentes com o ID
 *     parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID único da categoria
 *     responses:
 *       200:
 *         description: Contagem realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   total:
 *                     type: number
 *                     example: 2
 *       400:
 *         description: Parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/* QUERIES - Consultas específicas */
router.get("/:transaction_id/status", consultStatusController);
/**
 * @swagger
 * /api/transactions/{transaction_id}/status:
 *   get:
 *     tags: [Reports]
 *     summary: Consultar Status
 *     description: Verifica o status da transação pelo ID informado
 *     parameters:
 *      - in: path
 *        name: transaction_id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID único da categoria
 *     responses:
 *       200:
 *         description: Consulta realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [paid, pending]
 *                     example: paid
 *       400:
 *         description: Parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:transaction_id/category", consultCategoryController);
/**
 * @swagger
 * /api/transactions/{transaction_id}/category:
 *   get:
 *     tags: [Reports]
 *     summary: Consultar Categoria
 *     description: Verifica a categoria da transação pelo ID informado
 *     parameters:
 *      - in: path
 *        name: transaction_id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID único da categoria
 *     responses:
 *       200:
 *         description: Consulta realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: string
 *                     enum: [expense, revenue]
 *                     example: expense
 *       400:
 *         description: Parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:month/:year", getTransactionsController);

/**
 * @swagger
 * /api/transactions/{month}/{year}:
 *   get:
 *     tags: [Reports]
 *     summary: Consultar Transações
 *     description: Consulta todas as transações do mes e ano especificados.
 *     parameters:
 *      - in: path
 *        name: month
 *        required: true
 *        schema:
 *          type: integer
 *          example: 6
 *        description: mês especifico das transações
 *      - in: path
 *        name: year
 *        required: true
 *        schema:
 *          type: integer
 *          example: 2025
 *        description: ano especifico das transações
 *     responses:
 *       200:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
