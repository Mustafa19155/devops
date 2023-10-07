const mongoose = require("mongoose");

const { Schema } = mongoose;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  features: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  totalBookings: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Event", EventSchema);
