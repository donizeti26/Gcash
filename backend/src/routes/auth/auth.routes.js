import { Router } from "express";
import {
  loginController,
  createUserController,
  getMeController,
} from "../../controllers/auth/index.js";

import { authMiddleware } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.post("/login", loginController);

router.post("/register", createUserController);

router.get("/me", authMiddleware, getMeController);

export default router;
