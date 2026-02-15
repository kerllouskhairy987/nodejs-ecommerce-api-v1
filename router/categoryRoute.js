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
} = require("../utils/validators/categoryValidator");

const router = express.Router();

router.route("/").get(getListOfCategories).post(postCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getSingleCategoryById)
  .put(updateCategoryById)
  .delete(deleteCategoryById);

module.exports = router;
