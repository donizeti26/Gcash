// src/routes/paymentRoutes.js
import Router from "express";
import {
  getPaymentMethodsExpensesController,
  getPaymentMethodsRevenueController,
} from "../../controllers/payment-method/index.js";

const router = Router();

/* QUERIES */
router.get("/paymentMethods/expense", getPaymentMethodsExpensesController);
router.get("/paymentMethods/revenue", getPaymentMethodsRevenueController);

export default router;
