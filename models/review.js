const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  productID: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
