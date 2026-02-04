import { Router } from "express";
import { loginController } from "../../controllers/auth/index.js";

const router = Router();

router.post("/", loginController);

export default router;
