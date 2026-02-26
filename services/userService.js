const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");
const User = require("../models/userModel");
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("./handlersFactory");

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
// @access    Private
exports.postUser = createOne(User);

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private
exports.getUsers = getAll(User);

// @desc     Get Specific user
// @route    GET /api/v1/users/:id
// @access   Private
exports.getUser = getOne(User);

// @desc    Update Specific User
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = updateOne(User);

// @desc    Delete Specific User
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = deleteOne(User);
