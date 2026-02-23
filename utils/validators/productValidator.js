const { check } = require("express-validator");
const slugify = require("slugify");
const validateMiddleware = require("../../middlewares/categoryMiddleware");
const CategoryModel = require("../../models/categoryModel");
const ApiError = require("../apiError");
const SubCategoryModel = require("../../models/subCategoryModel");
const BrandModel = require("../../models/brandModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters long")
    // TODO: update slug if title is updated
    .custom((val, { req }) => {
      if (!val) return false;
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Sold must be a number")
    .isInt({ min: 0 })
    .withMessage("Sold must be a positive number"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Price after discount must be a positive number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error(
          "Price after discount must be less than the original price",
        );
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings"),

  check("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required")
    .isString()
    .withMessage("Image cover must be a string"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),

  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId")
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById({ _id: categoryId });
      if (!category) {
        throw new ApiError(
          `Category not found with this id ${categoryId}`,
          404,
        );
      }
    }),

  check("subcategories")
    .optional()
    .isArray()
    .withMessage("Subcategories must be an array of strings")
    .isMongoId()
    .withMessage("Subcategory must be a valid MongoDB ObjectId")
    // check if all subcategories exist
    .custom((subcategoriesIds) =>
      SubCategoryModel.find({
        _id: { $exists: true, $in: subcategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subcategoriesIds.length) {
          throw new ApiError(`Some or all subcategories not found`, 404);
        }
      }),
    )
    // check if all subcategories belong to this 🔝 category
    .custom((val, { req }) =>
      SubCategoryModel.find({ category: req.body.category }).then(
        (subcategories) => {
          const subcategoriesIdsInDB = [];
          subcategories.forEach((subcategory) => {
            subcategoriesIdsInDB.push(subcategory._id.toString());
          });
          const isExist = val.every((id) => subcategoriesIdsInDB.includes(id));
          if (!isExist) {
            throw new ApiError(
              `Some or all subcategories does not belong to this category`,
              404,
            );
          }
        },
      ),
    ),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ObjectId")
    .custom(async (brandId) => {
      const brand = await BrandModel.findById({ _id: brandId });
      if (!brand) {
        throw new ApiError(`Brand not found with this id ${brandId}`, 404);
      }
    }),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be between 1 and 5"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number")
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a positive integer"),

  validateMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  check("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters long")
    // TODO: update slug if title is updated
    .custom((val, { req }) => {
      if (!val) return false;
      req.body.slug = slugify(val);
      return true;
    }),

  validateMiddleware,
];

exports.getProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  validateMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  validateMiddleware,
];
