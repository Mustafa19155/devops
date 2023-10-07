const express = require("express");
const paymentRouter = express.Router();
const paymentController = require("../controllers/payment");
const checkAuth = require("../middlewares/checkAuth");

paymentRouter.post("/create-session", checkAuth, paymentController.createOrder);
paymentRouter.post(
  "/create-booking-session",
  checkAuth,
  paymentController.createBookingOrder
);
paymentRouter.post(
  "/create-membership-session",
  checkAuth,
  paymentController.createMembershipOrder
);
paymentRouter.get(
  "/status/:sessionId",
  checkAuth,
  paymentController.checkStatus
);

paymentRouter.get("/all", checkAuth, paymentController.getUserPayments);

module.exports = paymentRouter;
