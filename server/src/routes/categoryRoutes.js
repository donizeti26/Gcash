const express = require("express");

const {
  registerCatergoryController,
  getCategoriesController,
  getExpenseCategoriesController,
  getRevenueCategoriesController,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/categories", registerCatergoryController);
router.get("/categories", getCategoriesController);
router.get("/categoriesExpense", getExpenseCategoriesController);
router.get("/categoriesRevenue", getRevenueCategoriesController);

module.exports = router;
