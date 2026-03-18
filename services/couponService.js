const CouponModel = require("../models/couponModel");
const {
  getAll,
  createOne,
  updateOne,
  deleteOne,
  getOne,
} = require("./handlersFactory");

/**
 * @desc    get all coupons
 * @route   GET /api/v1/coupons
 * @access  private / admin - manager
 */
exports.getCoupons = getAll(CouponModel);

/**
 * @desc    get specific coupon
 * @route   GET /api/v1/coupon/:id
 * @access  private / admin - manager
 */
exports.getCoupon = getOne(CouponModel);

/**
 * @desc    create one coupon
 * @route   POST /api/v1/coupons
 * @access  private / admin
 */
exports.createCoupon = createOne(CouponModel);

/**
 * @desc   update specific coupon by id
 * @route   PUT /api/v1/coupons/:id
 * @access  private / admin - manager
 */
exports.updateCoupon = updateOne(CouponModel);

/**
 * @desc     delete specific coupon by id
 * @route    DELETE /api/v1/coupons/:id
 * @access   private / admin / manager
 */
exports.deleteCoupon = deleteOne(CouponModel);
