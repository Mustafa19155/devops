const Order = require("../models/order");
const User = require("../models/user");

exports.createOrder = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const data = req.body;

    const user = await User.findById(_id);

    if (!user.plan.discountUsed) {
      user.plan.discountUsed = true;
      await user.save();
    }

    data["userID"] = _id;

    const newOrder = new Order(data);
    await newOrder.save();
    // const order = await Order.create(data);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("products.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const order = await Order.find({ userID });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getProductOrders = async (req, res, next) => {
  try {
    const { productID } = req.params;
    const order = await Order.find({ productID });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
