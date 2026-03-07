const ReviewModel = require("../models/reviewModel");
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require("./handlersFactory");

/**
 * @desc    Get All Reviews
 * @route   GET /api/v1/reviews
 * @access  Public
 */
exports.getReviews = getAll(ReviewModel);

/**
 * @desc   Get Specific Review
 * @route  GET /api/v1/reviews/:id
 * @access Public
 */
exports.getReview = getOne(ReviewModel);

/**
 * @desc   Create Review
 * @route  POST /api/v1/reviews
 * @access  Private/Protect/User
 */
exports.createReview = createOne(ReviewModel);

/**
 * @desc   Update Review
 * @route  PUT /api/v1/reviews/:id
 * @access Private/Protect/User
 */
exports.updateReview = updateOne(ReviewModel);

/**
 * @desc   Delete Review by id
 * @route  DELETE /api/v1/reviews/:id
 * @access Private/Protect/User-Admin-Manager
 */
exports.deleteReview = deleteOne(ReviewModel);
