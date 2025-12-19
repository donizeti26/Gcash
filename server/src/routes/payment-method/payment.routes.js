// src/routes/paymentRoutes.js
import Router from "express";
import { getPaymentMethodsController } from "../../controllers/payment-method/index.js";

const router = Router();

/**
 * @swagger
 * /api/payment-methods/:
 *   get:
 *     tags: [PaymentMethods]
 *     summary: Lista todos os métodos de pagamento (check)
 *     description: Retorna todas os métodos de pagamento de acordo a query enviada.
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [expense, revenue]
 *     responses:
 *       200:
 *         description: Busca por métodos de pagamento feita com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethods'
 *       400:
 *         description: Parâmetro 'type' inválido. Use 'expense' ou 'revenue'.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro ao buscar métodos de pagamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getPaymentMethodsController);

export default router;
