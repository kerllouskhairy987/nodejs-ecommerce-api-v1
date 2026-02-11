const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// packages
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// files
const dbConnection = require("./config/database");
const categoryRoute = require("./router/categoryRoute");

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;

// ** 1- Connect To DB
dbConnection();

// express app
const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// mount routes
app.use("/api/v1/categories", categoryRoute);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
