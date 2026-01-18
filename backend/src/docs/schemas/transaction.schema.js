/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         category_id:
 *           type: integer
 *         payment_method_id:
 *           type: integer
 *         due_date:
 *           type: string
 *           format: date
 *         amount:
 *           type: number
 *           format: float
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [paid, pending]
 *     TransactionInput:
 *       type: object
 *       required:
 *         - category_id
 *         - payment_method_id
 *         - due_date
 *         - amount
 *         - description
 *         - status
 *       properties:
 *         category_id:
 *           type: integer
 *           example: 26
 *         payment_method_id:
 *           type: integer
 *           example: 5
 *         due_date:
 *           type: string
 *           format: date
 *           example: 2025-12-26
 *         amount:
 *           type: number
 *           format: float
 *           example: 500.00
 *         description:
 *           type: string
 *           example: Viagem ao litoral
 *         status:
 *           type: string
 *           enum: [paid, pending]
 *           example: paid
 */
