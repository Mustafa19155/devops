const mongoose = require("mongoose");

const { Schema } = mongoose;

const BannerSchema = new Schema({
  image: Array,
  type: String,
});

module.exports = mongoose.model("Banner", BannerSchema);
