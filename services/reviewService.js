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
 * @desc    Add productId to body when create review on product [nested route]
 * @route   POST /api/v1/products/:productId/reviews
 * @access  private/protect/User
 */
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id.toString();
  next();
};

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
