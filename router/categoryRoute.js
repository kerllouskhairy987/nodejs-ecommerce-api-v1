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

// Re-route into subCategory router
router.use("/:categoryId/subCategories", subCategoriesRoute);

// @route   /api/v1/categories/
router
  .route("/")
  .get(getListOfCategories)
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    postCategories,
  );

// @route   /api/v1/categories/:id
router
  .route("/:id")
  .get(getCategoryValidator, getSingleCategoryById)
  .put(updateCategoryValidator, updateCategoryById)
  .delete(deleteCategoryValidator, deleteCategoryById);

module.exports = router;
