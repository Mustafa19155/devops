const mongoose = require("mongoose");
const Payment = require("./payment");

const { Schema } = mongoose;

const OrderSchema = new Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: String,
      quantity: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    address: String,
    country: String,
    firstName: String,
    lastName: String,
    city: String,
    state: String,
    postCode: String,
    phone: String,
  },
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

OrderSchema.pre("save", async function (next) {
  try {
    const order = this;

    for (const pro of order.products) {
      let product = await mongoose.model("Product").findById(pro.product);

      // const leftProduct = product.quantity - pro.quantity;

      // if (leftProduct < 0) {
      //   return next({ message: "Insufficient product quantity" });
      // } else {
      product.quantity -= pro.quantity;
      await product.save();
      // }
    }

    Payment.create({
      userID: order.userID,
      orderID: order._id,
    });

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Order", OrderSchema);
