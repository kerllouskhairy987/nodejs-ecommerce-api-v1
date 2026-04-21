const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// Build In modules
const path = require("path");
// packages
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// files
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalErrorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
// routes
const mountRoutes = require("./router");
const { webhookCheckout } = require("./services/orderService");

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;

// ** 1- Connect To DB
dbConnection();

// express app
const app = express();

// Enable Author Domain To Access Resources
app.use(cors());

// compress all responses
app.use(compression());

// middlewares ==> make parsing for data
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// TODO: serve on static files
app.use(express.static(path.join(__dirname, "uploads")));

// TODO: Checkout Webhooks
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

// query parser for filtering on products
// app.set("query parser", "extended");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
  standardHeaders: "draft-8",
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/v1/auth", limiter);

// mount routes
mountRoutes(app);

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
