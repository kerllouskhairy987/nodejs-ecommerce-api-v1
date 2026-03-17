const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @desc    add address to user addresses list
 * @route   POST /api/v1/addresses
 * @access  private / protected / User only
 */
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: {
        addresses: req.body,
      },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Address added successfully",
    count: user.addresses.length,
    data: user.addresses,
  });
});

/**
 * @desc    remove address from user addresses list
 * @route   DELETE /api/v1/addresses/:addressId
 * @access  private / protected / User only
 */
exports.removeAddress = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Address removed successfully",
    data: user.addresses,
  });
});

/**
 * @desc    get user addresses
 * @route   GET /api/v1/addresses
 * @access  private / protected / User only
 */
exports.getLoggedInUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("addresses");

  res.status(200).json({
    success: true,
    count: user.addresses.length,
    data: user.addresses,
  });
});

/**
 * @desc   clear user addresses
 * @route   PUT /api/v1/addresses
 * @access  private / protected / User only
 */
exports.clearAddresses = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { addresses: [] },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Your addresses cleared successfully",
  });
});
