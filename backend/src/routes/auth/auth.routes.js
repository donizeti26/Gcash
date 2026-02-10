import { Router } from "express";
import {
  loginController,
  createUserController,
} from "../../controllers/auth/index.js";

const router = Router();

router.post("/login", loginController);

router.post("/register", createUserController);

export default router;
