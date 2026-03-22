const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const cartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel");
const { getOne, getAll } = require("./handlersFactory");

/**
 * @desc     create cash order
 * @route    POST /api/v1/orders/:cartItemId
 * @access   private/protect/user
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings admin can add them
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartItemId
  const cart = await cartModel.findById(req.params.cartItemId);
  if (!cart)
    return next(
      new ApiError(`Cart not found with this id ${req.params.cartItemId}`, 404),
    );

  // 2) Get order price depend on cart price [check if coupon apply or not]
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method [cash] {دي اول حاجة 1 - 2 بيخدموا عليها}
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {});

    // 5) Clear cart depend on cartItemId
    await cartModel.findByIdAndDelete(req.params.cartItemId);
  }

  res.status(200).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

/**
 * @desc     get all orders
 * @route    GET /api/v1/orders
 * @access   private/protect/admin
 */
exports.getOrders = getAll(OrderModel);

/**
 * @desc     get specific order by id
 * @route    GET /api/v1/orders/:id
 * @access   private/protect/admin
 */
exports.getOrder = getOne(OrderModel);
