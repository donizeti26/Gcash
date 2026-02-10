import { Router } from "express";

import authRoutes from "./auth/index.js";

import transactionRoutes from "./transaction/index.js";
import categoryRoutes from "./category/index.js";

import paymentRoutes from "./payment-method/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);

router.use("/payment-methods", paymentRoutes);
router.use("/transactions", transactionRoutes);

export default router;
