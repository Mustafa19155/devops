const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cart");
const checkAuth = require("../middlewares/checkAuth");

cartRouter.get("/", checkAuth, cartController.getCart);

cartRouter.put("/", checkAuth, cartController.updateCart);

module.exports = cartRouter;
