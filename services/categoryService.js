const slugify = require("slugify");
const CategoryModel = require("../models/categoryModel");

// ** post categories
const postCategories = (req, res) => {
  try {
    const name = req.body.name;

    CategoryModel.create({
      name,
      slug: slugify(name),
    })
      .then((doc) => {
        res.status(201).json(doc);
      })
      .catch((error) => {
        res.status(400).send({ error: error });
      });
    // const newCategory = new CategoryModel({ name });
    // newCategory
    //   .save()
    //   .then((doc) => {
    //     res.send(doc);
    //   })
    //   .catch((error) => {
    //     res.status(400).send({ error: error });
    //   });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

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
