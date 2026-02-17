const express = require("express");
const {
  postSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router();

// @route   /api/v1/subCategories/
router
  .route("/")
  .get(getSubCategories)
  .post(createSubCategoryValidator, postSubCategory);

// @route   /api/v1/subCategories/:id
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
