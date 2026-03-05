const express = require("express");
const {
  postUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  updateUserPassword,
  applyUserIdToReqParamsIdInGetUserData,
  updateLoggedInUserPassword,
  updateUserDataWithoutPasswordAndRole,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  updateLoggedInUserPasswordValidator,
  updateLoggedInUserDataValidator,
} = require("../utils/validators/userValidator");
const { allowedTo, protect } = require("../services/authService");

const router = express.Router();

// for user
router.get("/get-me", protect, applyUserIdToReqParamsIdInGetUserData, getUser);

router.put(
  "/change-my-password",
  protect,
  updateLoggedInUserPasswordValidator,
  updateLoggedInUserPassword,
);

router.put(
  "/change-my-data",
  protect,
  uploadUserImage,
  resizeUserImage,
  updateLoggedInUserDataValidator,
  updateUserDataWithoutPasswordAndRole,
);

// -----------------------------------------------------------------

// for admin
router.use(protect, allowedTo("admin"));

router
  .route("/change-password/:id")
  .put(protect, updateUserPasswordValidator, updateUserPassword);

router
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, postUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
