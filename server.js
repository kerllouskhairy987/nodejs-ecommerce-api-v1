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
const apiError = require("./utils/apiError");

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

// ** 404 unhandling routes middleware
app.use((req, res, next) => {
  // const error = new Error(`Can't find this route: ${req.originalUrl}`);
  // error.statusCode = 404;
  // next(error);
  next(new apiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode === 200 ? 500 : err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    error: err,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
