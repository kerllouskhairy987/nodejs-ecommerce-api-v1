const express = require("express");
const {
  postCategories,
  getListOfCategories,
} = require("../services/categoryService");
const router = express.Router();

router.post("/", postCategories);
router.get("/categories", getListOfCategories);

module.exports = router;
