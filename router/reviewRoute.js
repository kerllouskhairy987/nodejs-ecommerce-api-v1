const express = require("express");
const {
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createReview,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const { protect, allowedTo } = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReviews)
  .post(
    protect,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
