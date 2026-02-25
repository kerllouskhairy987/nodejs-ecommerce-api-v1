const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// Build In modules
const path = require("path");
// packages
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// files
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalErrorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
// routes
const categoryRoute = require("./router/categoryRoute");
const subCategoryRoute = require("./router/subCategoryRoute");
const brandRoute = require("./router/brandRoute");
const productRoute = require("./router/productRoute");

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;

// ** 1- Connect To DB
dbConnection();

// express app
const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: serve on static files
app.use(express.static(path.join(__dirname, "uploads")));

// query parser for filtering on products
app.set("query parser", "extended");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

// ** 404 unhandling routes middleware (inside express)
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// global error handler middleware for [express] (outside express)
app.use(globalErrorHandlingMiddleware);

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// ** Handle Unhandled Rejection Errors
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection error: ${err}`);
  server.close(() => {
    console.log("shutting down...");
    process.exit(1);
  });
});
