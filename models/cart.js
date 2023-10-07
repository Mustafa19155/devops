const mongoose = require("mongoose");

const { Schema } = mongoose;

const CartSchema = new Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      size: String,
      quantity: Number,
    },
  ],
  total: Number,
});

module.exports = mongoose.model("Cart", CartSchema);
