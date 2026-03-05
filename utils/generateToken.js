const jwt = require("jsonwebtoken");

/**
 * @desc    Generate Token Function
 */
const generateToken = (payload) => {
  const token = jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

module.exports = generateToken;
