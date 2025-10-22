import express from "express";
const { createUser } = require("../controllers/userController");
const router = express.Router();

router.post("/usuarios", createUser);

export default router;
