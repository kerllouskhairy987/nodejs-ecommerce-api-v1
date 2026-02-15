const express = require("express");
const { param, validationResult } = require("express-validator");
const apiError = require("../utils/apiError");

const {
  postCategories,
  getListOfCategories,
  getSingleCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../services/categoryService");

const router = express.Router();

router.route("/").get(getListOfCategories).post(postCategories);
router
  .route("/:id")
  .get(
    // 1- Rules
    param("id").isMongoId().withMessage("Invalid category ID"),
    // 2- middleware ==> catches errors from rules if exists
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new apiError(`${errors.array()[0].msg}`, 400));
      }
      next();
    },
    getSingleCategoryById,
  )
  .put(updateCategoryById)
  .delete(deleteCategoryById);

module.exports = router;
