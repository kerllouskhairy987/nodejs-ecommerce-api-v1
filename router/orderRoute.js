const express = require("express");

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");
const {
  createCashOrder,
  getOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");
const {
  createCashOrderValidator,
} = require("../utils/validators/orderValidator");

// -------------------------For Admin-Manager & User-------------------------
router.route("/").get(protect, getOrders);
router.get("/:id", protect, getOrder);

// -------------------------For Admin-Manager-------------------------
router.put(
  "/:id/pay",
  protect,
  allowedTo("admin", "manager"),
  updateOrderToPaid,
);
router.put(
  "/:id/deliver",
  protect,
  allowedTo("admin", "manager"),
  updateOrderToDelivered,
);

// -------------------------For User-------------------------
router.use(protect, allowedTo("user"));

router.post("/:cartItemId", createCashOrderValidator, createCashOrder);
router.get("/checkout-session/:cartItemId", checkoutSession);

module.exports = router;
