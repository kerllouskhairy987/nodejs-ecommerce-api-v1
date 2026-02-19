const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const dbConnection = require("../../config/database");
const ProductModel = require("../../models/productModel");

dotenv.config({ path: `${__dirname}/../../config.env` });

// read products
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8"),
);

// insert products
const insertProducts = async () => {
  try {
    await ProductModel.insertMany(products);
    console.log("data added successfully!");
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// delete products
const deleteProducts = async () => {
  try {
    await ProductModel.deleteMany({});
    console.log("data deleted successfully!");
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const run = async () => {
  // connect with DB
  await dbConnection();

  if (process.argv[2] === "-i") {
    insertProducts();
  } else if (process.argv[2] === "-d") {
    deleteProducts();
  }
};

run();
