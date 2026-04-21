const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const { sanitizeSingUp, sanitizeLogin } = require("../utils/sanitizeData");

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

  res.status(201).json({ data: sanitizeSingUp(user), token });
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

  res.status(200).json({ data: sanitizeLogin(user), token });
});

/**
 * @desc    Protect Routes Make Sure That User Logged In (authenticated)
 * @route   POST /api/v1/[anyRoute]
 * @access  Private
 */
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check token exists, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not logged in, please log in first to get access",
        401,
      ),
    );
  }

  // 2) verify token(invalid ,expired)
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) check if user exist
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist",
        401,
      ),
    );
  }
  // check user is active
  if (!user.active) {
    return next(
      new ApiError(
        "User is not active, please activate your account or contact admin",
        401,
      ),
    );
  }

  // 4) check if password is changed after token is generated or not if changed you must login again
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10,
    );
    // password changed after token is generated
    if (decoded.iat < changedTimestamp) {
      return next(
        new ApiError("User recently changed password, please login again", 401),
      );
    }
  }

  req.user = user; // use it in authorization
  next();
});

/**
 * @desc    Protect for activate User Routes Make Sure That User Logged In (authenticated)
 * @route   POST /api/v1/[anyRoute]
 * @access  Private
 */
exports.protectForActivateUserAccount = asyncHandler(async (req, res, next) => {
  // 1) check token exists, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not logged in, please log in first to get access",
        401,
      ),
    );
  }

  // 2) verify token(invalid ,expired)
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) check if user exist
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist",
        401,
      ),
    );
  }

  // 4) check if password is changed after token is generated or not if changed you must login again
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10,
    );
    // password changed after token is generated
    if (decoded.iat < changedTimestamp) {
      return next(
        new ApiError("User recently changed password, please login again", 401),
      );
    }
  }

  req.user = user; // use it in authorization
  next();
});

/**
 * @desc    check if user is admin or manager (authorization)
 * @route   POST /api/v1/[anyRoute]
 * @access  Private
 */
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    console.log(roles); // [ 'admin', 'manager' ]
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route.", 403),
      );
    }

    next();
  });

/**
 * @desc    forgot password (Step 1 of 3)
 * @route   POST /api/v1/auth/forgot-password
 * @access  public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get User By Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404),
    );
  }

  // 2) if user exist Generate hash Random 6 digit code and save it in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // save in db
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  user.passwordResetVerified = false;
  await user.save();

  // 3) Send reset code to user email

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      resetCode,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    return next(new ApiError("Failed to send email", 500));
  }

  res.status(200).json({
    success: true,
    message: "Reset code sent to your email, this code will expire in 10 min",
  });
});

/**
 * @desc    verify reset password code (Step 2 of 3)
 * @route   POST /api/v1/auth/reset-password
 * @access  public
 */
exports.verifyResetPasswordCode = asyncHandler(async (req, res, next) => {
  // 1) get user depend on reset his/him code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }

  // 2) reset code is valid and not expired then verify passwordResetVerified
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Reset code is valid",
  });
});

/**
 * @desc    reset password (Step 3 of 3)
 * @route   PUT /api/v1/auth/reset-password
 * @access  public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user depend on email
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }

  // 2) check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }

  // 3) update password
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // 4) generate new token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
  });
});
