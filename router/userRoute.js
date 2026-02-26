const express = require("express");
const {
  postUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
} = require("../services/userService");

const router = express.Router();

router
  .route("/")
  .post(uploadUserImage, resizeUserImage, postUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeUserImage, updateUser)
  .delete(deleteUser);

module.exports = router;
