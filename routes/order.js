const express = require("express");
const orderController = require("../controllers/order");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const orderRouter = express.Router();

orderRouter.post("/", checkAuth, orderController.createOrder);
orderRouter.get("/", isAdmin, orderController.getAllOrders);
orderRouter.get("/:id", checkAuth, orderController.getOrderById);
// orderRouter.delete("/:id", orderController.deleteOrder);
orderRouter.get("/user/:userID", checkAuth, orderController.getUserOrders);
orderRouter.get("/product/:productID", orderController.getProductOrders);

module.exports = orderRouter;
