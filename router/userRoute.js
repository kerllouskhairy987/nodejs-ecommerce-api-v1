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

router
  .route("/change-password/:id")
  .put(protect, updateUserPasswordValidator, updateUserPassword);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    postUser,
  )
  .get(protect, allowedTo("admin"), getUsers);

router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUserValidator, getUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser,
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
