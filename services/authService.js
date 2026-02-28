const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

const generateToken = (payload) => {
  const token = jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
/**
 * @desc    signup
 * @route   POST /api/v1/auth/signup
 * @access  public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate Token
  const token = generateToken(user._id);

  res.status(201).json({ data: user, token });
});

/**
 * @desc    login
 * @route   POST /api/v1/auth/login
 * @access  public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  // 1) check if user exist and password is correct
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  // 2) generate token
  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});
