const express = require("express");

const router = express.Router();

const {
  postCategories,
  getListOfCategories,
  getSingleCategoryById,
  updateCategoryById,
  deleteCategoryById,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoriesRoute = require("./subCategoryRoute");
const { protect, allowedTo } = require("../services/authService");

// Re-route into subCategory router
router.use("/:categoryId/subCategories", subCategoriesRoute);

// @route   /api/v1/categories/
router
  .route("/")
  .get(protect, getListOfCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    postCategories,
  );

// @route   /api/v1/categories/:id
router
  .route("/:id")
  .get(getCategoryValidator, getSingleCategoryById)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategoryById,
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategoryById,
  );

module.exports = router;
