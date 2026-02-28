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

const router = express.Router();

router
  .route("/change-password/:id")
  .put(updateUserPasswordValidator, updateUserPassword);

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
