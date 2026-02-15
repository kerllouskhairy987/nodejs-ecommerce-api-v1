const express = require("express");

const {
  postCategories,
  getListOfCategories,
  getSingleCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validators/categoryValidator");

const router = express.Router();

// @route   /api/v1/categories/
router
  .route("/")
  .get(getListOfCategories)
  .post(createCategoryValidator, postCategories);

// @route   /api/v1/categories/:id
router
  .route("/:id")
  .get(getCategoryValidator, getSingleCategoryById)
  .put(updateCategoryValidator, updateCategoryById)
  .delete(deleteCategoryValidator, deleteCategoryById);

module.exports = router;
