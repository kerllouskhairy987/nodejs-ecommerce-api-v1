const express = require("express");
const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");
const {
  signup,
  login,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetPasswordCode);
router.put("/reset-password", resetPasswordValidator, resetPassword);

module.exports = router;
