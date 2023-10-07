const Cart = require("../models/cart");
const mongoose = require("mongoose");
const calculateDiscount = require("../middlewares/calculateDiscount");

exports.getCart = async (req, res, next) => {
  const { _id } = req.user;
  const user = req.user;
  try {
    const cart = await Cart.findOne({ userID: _id }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(404).send("cart not found");
    }

    cart.products.forEach((cartItem) => {
      const discountedPrice = calculateDiscount(cartItem.product, user);

      cartItem.product.price = discountedPrice;
    });

    const filteredCartProducts = cart.products.filter((pro) => {
      return pro.product.quantity - pro.quantity >= 0;
    });

    cart.products = filteredCartProducts;

    cart.total = filteredCartProducts.reduce((acc, pro) => {
      const itemTotal = pro.quantity * pro.product.price;
      return acc + itemTotal;
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  const { _id } = req.user;
  const { total, products } = req.body;

  try {
    let cart = await Cart.findOne({ userID: _id });

    cart.total = total;
    cart.products = products.map((pro) => {
      return {
        ...pro,
        product: mongoose.Types.ObjectId(pro.product),
      };
    });

    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};
