const mongoose = require("mongoose");

const dbConnection = async () => {
  const conn = await mongoose.connect(process.env.DB_URI);
  console.log(`connected: ${conn.connection.host}`);
};

module.exports = dbConnection;

// const dbConnection = async () => {
//   mongoose
//     .connect(process.env.DB_URI)
//     .then(() => console.log("DB connected"))
//     .catch((err) => {
//       console.error("DB Error:", err);
//       process.exit(1);
//     });
// };
