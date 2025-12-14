// src/routes/paymentRoutes.js
import express from "express";
import {
  getPaymentMethodsExpensesController,
  getPaymentMethodsRevenueController,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/paymentMethods/expense", getPaymentMethodsExpensesController);
router.get("/paymentMethods/revenue", getPaymentMethodsRevenueController);

export default router;
