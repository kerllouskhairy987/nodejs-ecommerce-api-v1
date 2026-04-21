/**
 * @desc    Sanitize sing up data before sending it to the client
 * @param   {Object} user - The user object to sanitize
 * @returns {Object} - The sanitized user object
 */
exports.sanitizeSingUp = function (user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * @desc    Sanitize login data before sending it to the client
 * @param   {Object} user - The user object to sanitize
 * @returns {Object} - The sanitized user object
 */
exports.sanitizeLogin = function (user) {
  return {
    _id: user._id,
    name: user.name,
    slug: user.slug,
    email: user.email,
    phone: user.phone,
    role: user.role,
    active: user.active,
    wishlist: user.wishlist,
    addresses: user.addresses,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
