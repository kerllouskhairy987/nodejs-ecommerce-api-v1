const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @desc      add product to wishlist
 * @route    POST /api/v1/wishlist
 * @access   private / protected / User only
 */
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet ==> if the product is already in the wishlist, it will not be added again
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Product added to your wishlist",
    data: user.wishlist,
  });
});

/**
 * @desc    remove product from wishlist
 * @route   DELETE /api/v1/wishlist/:productId
 * @access  private / protected / User only
 */
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Product removed from your wishlist",
    data: user.wishlist,
  });
});

/**
 * @desc    get all product in wishlist
 * @route   GET   /api/v1/wishlist
 * @access  private / protected / User only
 */
exports.getLoggedInUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("wishlist");

  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist,
  });
});

/**
 * @desc    clear wishlist
 * @route   PUT /api/v1/wishlist
 * @access  private / protected / User only
 */
exports.clearWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { wishlist: [] },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Your wishlist cleared successfully",
    data: user.wishlist,
  });
});
