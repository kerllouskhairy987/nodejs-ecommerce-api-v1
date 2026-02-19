// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config({ path: "../config.env" });

// const dbConnection = () => {
//   mongoose.connect(process.env.DB_URI).then((success) => {
//     console.log(`connected: ${success.connection.host}`);
//   });
// };

// module.exports = dbConnection;

const mongoose = require("mongoose");

const dbConnection = async () => {
  const conn = await mongoose.connect(process.env.DB_URI);
  console.log(`connected: ${conn.connection.host}`);
};

module.exports = dbConnection;
