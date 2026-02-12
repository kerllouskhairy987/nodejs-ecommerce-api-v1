const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((success) => {
    console.log(`connected: ${success.connection.host}`);
  });
  // .catch((error) => {
  //   console.log(`error: ${error}`);
  //   process.exit(1);
  // });
};

module.exports = dbConnection;
