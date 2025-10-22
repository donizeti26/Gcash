// src/routes/paymentRoutes.js
import express from "express";
import { getPaymentMethodsController } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/paymentmethods", getPaymentMethodsController);

export default router;
