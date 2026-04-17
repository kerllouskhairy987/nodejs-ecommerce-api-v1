const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET);
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

/**
 * @desc     update order paid status to paid
 * @route    PUT /api/v1/orders/:id/pay
 * @access   private/protect/admin-manager
 */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`Order not found with this id ${req.params.id}`, 404),
    );
  }

  // update order to paid and save in DB
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "Order paid successfully",
    data: updateOrder,
  });
});

/**
 * @desc     update order delivered to delivered
 * @route    PUT /api/v1/orders/:id/deliver
 * @access   private/protect/admin-manager
 */
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`Order not found with this id ${req.params.id}`, 404),
    );
  }

  // update order to delivered and save in DB
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updateOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "Order delivered successfully",
    data: updateOrder,
  });
});

/**
 * @desc     Get Checkout Session From Stripe And Send It To Client In Response
 * @route    GET or POST /api/v1/orders/checkout-session/:cartItemId
 * @access   private/protect/user
 */
exports.checkoutSession = asyncHandler(async (req, res, next) => {
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

  // 3) create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
            // description: "Comfortable cotton t-shirt",
            // images: ["https://example.com/t-shirt.png"],
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`, // http://localhost:3000/orders ==> dynamic url
    cancel_url: `${req.protocol}://${req.get("host")}/cart`, // http://localhost:3000/cart ==> dynamic url
    customer_email: req.user.email,
    client_reference_id: req.params.cartItemId, // عشان لما العمله تنجح عايز اعمل create order
    metadata: {
      address: JSON.stringify(req.body.shippingAddress), // عشان لما العمله تنجح عايز اعمل create order
    },
  });

  // 4) send session to response
  res.status(200).json({
    success: true,
    message: "Checkout session created successfully",
    session,
  });
});
