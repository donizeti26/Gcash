const express = require("express");
const {
  getTransactionsController,
  createTransactionController,
  editTransactionsController,
  updateStatusController,
  consultStatusController,
  sumTransactionController,
  pendingTransactionsController,
  paidTransactionsController,
} = require("../controllers/transactionController");

const router = express.Router();

// Rotas de transações
router.get("/transactionsGet", getTransactionsController);
router.post("/transactions", createTransactionController);
router.get("/transactions/:transaction_id", editTransactionsController);
router.patch("/transactions/:transaction_id/status", updateStatusController);
router.get("/transactions/:transaction_id/status", consultStatusController);
router.get("/transactions/sum/:month/:year", sumTransactionController);
router.get("/transactions/pending/:month/:year", pendingTransactionsController);
router.get("/transactions/paid/:month/:year", paidTransactionsController);

module.exports = router;
