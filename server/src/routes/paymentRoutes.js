const express = require("express");
const {
  getPaymentMethodsController,
} = require("../controllers/paymentController");
const router = express.Router();

router.get("/paymentmethods", getPaymentMethodsController);

module.exports = router;
