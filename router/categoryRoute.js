const express = require("express");
const {
  postCategories,
  getListOfCategories,
} = require("../services/categoryService");
const router = express.Router();

router.route("/").get(getListOfCategories).post(postCategories);

module.exports = router;
