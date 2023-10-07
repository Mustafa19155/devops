const mongoose = require("mongoose");

const { Schema } = mongoose;

const StripeSession = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("stripeSession", StripeSession);
