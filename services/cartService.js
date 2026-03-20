const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const CouponModel = require("../models/couponModel");

/**
 * @desc    calc total cart price
 * @param   cart
 * @returns Number
 */
const calcTotalCartPrice = (cart) => {
  const totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

/**
 * @desc     Add product to cart
 * @route    POST /api/v1/cart
 * @access   private / protected / user
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);

  // 1) get cart for logged user
  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    // 01) if no cart create cart
    cart = await cartModel.create({
      user: req.user.id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // 02) if cart exist
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );

    if (productIndex !== -1) {
      // product and its color are exist in cart, then update product quantity
      cart.cartItems[productIndex].quantity += 1;
    } else {
      // product not exist in cart, then push product to cart
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  // 3) calculate total cart price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    count: cart.cartItems.length,
    data: cart,
  });
});

/*
  1) add product to cart if no cart
  {
    1) product and its color are exist in cart, then update product quantity
    2) product not exist in cart, then push product to cart
  }
*/

/**
 * @desc     get logged in user cart
 * @route    GET /api/v1/cart
 * @access   private / protected / user
 */
exports.getLoggedInUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user ${req.user._id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    message: "Cart found",
    count: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc     remove specific cart item from cart items
 * @route    DELETE /api/v1/cart/:cartItemId
 * @access   private / protected / user
 */
exports.removeItemFromCartItems = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.cartItemId } },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user ${req.user._id}`, 404),
    );
  }

  // calculate total cart price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    count: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc     clear cart items
 * @route    DELETE /api/v1/cart
 * @access   private / protected / user
 */
exports.clearCartItems = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndDelete({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user ${req.user._id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    message: "Your cart cleared successfully",
  });
});

/**
 * @desc      update cart item quantity
 * @route     PUT /api/v1/cart/:cartItemId
 * @access    private / protected / user
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user ${req.user._id}`, 404),
    );
  }

  const cartItem = cart.cartItems.find(
    (item) => item._id.toString() === req.params.cartItemId,
  );

  if (!cartItem) {
    return next(
      new ApiError(
        `there is no cart item with this id ${req.params.cartItemId}`,
        404,
      ),
    );
  }

  cartItem.quantity = req.body.quantity;

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product quantity updated successfully",
    count: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc     apply coupon on logged in user cart
 * @route    POST /api/v1/cart/apply-coupon
 * @access   private / protected / user
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) check if that coupon is valid or not
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("invalid or expired coupon", 400));
  }

  // 2) get cart for logged in user to calculate total cart price after discount
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user ${req.user._id}`, 404),
    );
  }

  const totalPrice = calcTotalCartPrice(cart);

  // 3) calculate discount amount
  const discountAmount = ((totalPrice * Number(coupon.discount)) / 100).toFixed(
    2,
  );

  // 4) calculate new total cart price after discount
  const totalPriceAfterDiscount = totalPrice - discountAmount;

  // 5) update cart total price after discount
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: cart,
  });
});
