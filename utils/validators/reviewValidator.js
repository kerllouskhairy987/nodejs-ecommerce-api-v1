const { check } = require("express-validator");
const validateMiddleware = require("../../middlewares/categoryMiddleware");
const ReviewModel = require("../../models/reviewModel");
const ApiError = require("../apiError");

/**
 * @desc    validators for create review routes
 */
exports.createReviewValidator = [
  check("title").optional(),

  check("ratings")
    .notEmpty()
    .withMessage("Ratings is required")
    .isNumeric()
    .withMessage("Ratings must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1 and 5"),

  check("user")
    .isMongoId()
    .withMessage("User must be a valid MongoDB ObjectId")
    // single user can add one review
    .custom(async (userId, { req }) => {
      if (userId !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to add a review", 403);
      }

      const review = await ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (review) {
        throw new ApiError("You have already reviewed this product", 400);
      }
    }),

  check("product")
    .isMongoId()
    .withMessage("Product must be a valid MongoDB ObjectId"),
  validateMiddleware,
];

/**
 * @desc    validators for update review routes
 */
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format")
    .custom(async (id, { req }) => {
      const review = await ReviewModel.findById(id);
      if (!review) throw new ApiError("Review not found", 404);

      if (review.user._id.toString() !== req.user._id.toString())
        throw new ApiError("You are not authorized to update this review", 403);
    }),

  check("ratings")
    .optional()
    .isNumeric()
    .withMessage("Ratings must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1 and 5"),

  check("user")
    .optional()
    .isMongoId()
    .withMessage("User must be a valid MongoDB ObjectId"),

  check("product")
    .optional()
    .isMongoId()
    .withMessage("Product must be a valid MongoDB ObjectId"),

  validateMiddleware,
];

/**
 * @desc    validators for get review routes
 */
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review ID format"),

  validateMiddleware,
];

/**
 * @desc    validators for delete review routes
 */
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format")
    // only created review can delete it or (admin or manager)
    .custom(async (id, { req }) => {
      if (req.user.role === "user") {
        const review = await ReviewModel.findById(id);
        if (!review) throw new ApiError("Review not found", 404);
        if (req.user._id.toString() !== review.user.toString())
          throw new ApiError(
            "You are not authorized to delete this review, allow to admin or manager or created by you",
            403,
          );
      }
    }),

  validateMiddleware,
];
