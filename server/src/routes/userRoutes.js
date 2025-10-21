const express = require("express");
const { createUser } = require("../controllers/userController");
const router = express.Router();

router.post("/usuarios", createUser);

module.exports = router;
