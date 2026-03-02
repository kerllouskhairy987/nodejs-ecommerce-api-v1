const express = require("express");
const {
  postSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router({ mergeParams: true });

// @route   /api/v1/subCategories/
router
  .route("/")
  .get(getSubCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    postSubCategory,
  );

// @route   /api/v1/subCategories/:id
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;
