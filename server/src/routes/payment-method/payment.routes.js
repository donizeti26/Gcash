// src/routes/paymentRoutes.js
import Router from "express";
import { getPaymentMethodsController } from "../../controllers/payment-method/index.js";

const router = Router();

/**
 * @swagger
 * /api/payment-methods/paymentMethods/expense:
 *   get:
 *     tags: [PaymentMethods]
 *     summary: Lista métodos de pagamento
 *     description: Retorna todas os métodos de pagamento do tipo despesa
 *     response:
 *       200:
 *         description: Lista de Métodos de pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethods'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getPaymentMethodsController);

export default router;
