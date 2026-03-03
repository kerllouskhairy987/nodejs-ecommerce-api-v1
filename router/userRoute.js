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
  ablyUserIdToReqParamsId,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
} = require("../utils/validators/userValidator");
const { allowedTo, protect } = require("../services/authService");

const router = express.Router();

// for user
router.route("/get-me").get(protect, ablyUserIdToReqParamsId, getUser);

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
