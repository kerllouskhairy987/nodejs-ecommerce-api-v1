const express = require("express");
const {
  createCoupon,
  getCoupons,
  getCoupon,
  deleteCoupon,
  updateCoupon,
} = require("../services/couponService");
const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../utils/validators/couponValidator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect, allowedTo("admin", "manager"));

router.route("/").post(createCouponValidator, createCoupon).get(getCoupons);

router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
