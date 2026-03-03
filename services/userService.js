const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");
const { createOne, getAll, getOne, deleteOne } = require("./handlersFactory");

const ApiError = require("../utils/apiError");

// TODO: Middleware for uploading user image
exports.uploadUserImage = uploadSingleImage("profileImg");

// TODO: Middleware for resizing user image
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    // save image to DB
    req.body.profileImg = filename;
  }

  next();
});

// @desc      Create User
// @route     POST /api/v1/users
// @access    Private/Admin-Manager
exports.postUser = createOne(User);

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = getAll(User);

// @desc     Get Specific user
// @route    GET /api/v1/users/:id
// @access   Private/Admin
exports.getUser = getOne(User);

// @desc    Update Specific User
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // delete password if user want to update password
  if (req.body && req.body.password) {
    delete req.body.password;
  }
  if (req.body && req.body.role === "user") delete req.body.active;

  const document = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return next(
      new ApiError(`document not found with this id ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: document,
    message: "document updated successfully",
  });
});

/**
 * @desc    Update Specific User Password
 * @route   PUT /api/v1/users/change-password/:id
 * @access  Private/Admin
 */
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!document) {
    return next(
      new ApiError(`document not found with this id ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: document,
    message: "document updated successfully",
  });
});

/**
 * @desc    Delete Specific User
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = deleteOne(User);

/**
 * @desc    ably req.params === req.user._id
 * @route   GET  /api/v1/users/get-me
 * @access  Private / protected
 */
exports.ablyUserIdToReqParamsId = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
