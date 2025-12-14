import express from "express";
import {
  getTransactionsController,
  createTransactionController,
  consultCategoryController,
  editTransactionsController,
  updateTransactionsController,
  updateStatusController,
  consultStatusController,
  sumTransactionController,
  sumTransactionRevenueController,
  pendingTransactionsController,
  paidTransactionsController,
  deleteTransactionsController,
  countTransactionsController,
} from "../controllers/transactionController.js";

const router = express.Router();

// Rotas de transações
router.get("/transactionsGet/:month/:year", getTransactionsController);
router.post("/transactions", createTransactionController);
router.get("/transactionsCategory/:transaction_id", consultCategoryController);
router.get("/transactions/:transaction_id", editTransactionsController);

router.patch("/transactions/:transaction_id/:status", updateStatusController);
router.put("/updateTransactions/:transaction_id", updateTransactionsController);
router.get(
  "/transactionsConsult/:transaction_id/:status",
  consultStatusController
);
router.get("/transactions/sum/:month/:year", sumTransactionController);
router.get(
  "/transactions/sum/revenue/:month/:year",
  sumTransactionRevenueController
);

router.get("/transactions/pending/:month/:year", pendingTransactionsController);
router.get("/transactions/paid/:month/:year", paidTransactionsController);
router.delete("/:transaction_id", deleteTransactionsController);
router.get("/contTransaction/:id", countTransactionsController);
export default router;
