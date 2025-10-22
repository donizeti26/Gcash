import express from "express";

import {
  registerCatergoryController,
  getCategoriesController,
  getExpenseCategoriesController,
  getRevenueCategoriesController,
} from "../controllers/categoryController";

const router = express.Router();

router.post("/categories", registerCatergoryController);
router.get("/categories", getCategoriesController);
router.get("/categoriesExpense", getExpenseCategoriesController);
router.get("/categoriesRevenue", getRevenueCategoriesController);

export default router;
