const express = require("express");

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");
const {
  createCashOrder,
  getOrders,
  getOrder,
} = require("../services/orderService");
const {
  createCashOrderValidator,
} = require("../utils/validators/orderValidator");

// -------------------------For Admin-Manager & User-------------------------
router.use(protect);

router.route("/").get(getOrders);
router.get("/:id", getOrder);

// -------------------------For User-------------------------
router.use(protect, allowedTo("user"));

router.post("/:cartItemId", createCashOrderValidator, createCashOrder);

module.exports = router;
