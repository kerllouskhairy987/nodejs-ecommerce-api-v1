const express = require("express");
const {
  addAddress,
  getLoggedInUserAddresses,
  removeAddress,
  clearAddresses,
} = require("../services/addressService");
const { protect, allowedTo } = require("../services/authService");
const { addAddressValidator } = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addAddressValidator, addAddress)
  .get(getLoggedInUserAddresses)
  .delete(clearAddresses);

router.delete("/:addressId", removeAddress);

module.exports = router;
