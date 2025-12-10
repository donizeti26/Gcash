import express from "express";

import {
  registerCategoryController,
  getCategoriesController,
  getExpenseCategoriesController,
  getRevenueCategoriesController,
  getSelectedCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/categories", registerCategoryController);
router.get("/categories", getCategoriesController);
router.get("/category/selected/:id", getSelectedCategoryController);
router.get("/categoriesExpense", getExpenseCategoriesController);
router.get("/categoriesRevenue", getRevenueCategoriesController);

export default router;
