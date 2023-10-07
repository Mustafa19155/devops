const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  planID: {
    type: mongoose.Types.ObjectId,
    ref: "Plan",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
