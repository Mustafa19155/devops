const mongoose = require("mongoose");

const { Schema } = mongoose;

const PaymentSchema = new Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  orderID: {
    type: mongoose.Types.ObjectId,
    ref: "Order",
  },
  planID: {
    type: mongoose.Types.ObjectId,
    ref: "Plan",
  },
  bookingID: {
    type: mongoose.Types.ObjectId,
    ref: "Booking",
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
