const express = require("express");
const multer = require("multer");

const router = express.Router();

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

const subCategoriesRoute = require("./subCategoryRoute");

const upload = multer({ dest: "uploads/categories" });

// Re-route into subCategory router
router.use("/:categoryId/subCategories", subCategoriesRoute);

// @route   /api/v1/categories/
router
  .route("/")
  .get(getListOfCategories)
  .post(
    upload.single("image"),
    (req, res, next) => {
      console.log(req.file);
      console.log(req.body);
      next();
    },
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
