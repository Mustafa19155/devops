const mongoose = require("mongoose");

const { Schema } = mongoose;

const SocialPostSchema = new Schema({
  type: {
    type: String,
  },
  image: {
    type: String,
  },
  url: {
    type: String,
  },
});

module.exports = mongoose.model("SocialPost", SocialPostSchema);
