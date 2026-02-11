const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");

// ** post categories
const postCategories = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const createdCategory = await CategoryModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({
    data: createdCategory,
    message: "Category created successfully",
  });
});

// ** get list of categories
const getListOfCategories = (req, res) => {
  try {
    CategoryModel.find()
      .then((docs) => {
        res.send(docs);
      })
      .catch((error) => {
        res.send(error);
      });
  } catch (error) {
    res.send({ message: error.message });
  }
};

module.exports = {
  postCategories,
  getListOfCategories,
};
