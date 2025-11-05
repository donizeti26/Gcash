// src/routes/paymentRoutes.js
import express from "express";
import {
  getPaymentMethodsExpensesController,
  getPaymentMethodsRevenueController,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/paymentmethods/expense", getPaymentMethodsExpensesController);
router.get("/paymentmethods/revenue", getPaymentMethodsRevenueController);

export default router;
