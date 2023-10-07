const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    productImages: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    sizes: [],
    features: [],
    reviews: [
      {
        reviewID: {
          type: mongoose.Types.ObjectId,
          ref: "Review",
        },
      },
    ],
  },
  { timestamps: true }
);

// ProductSchema.pre(/^find/, async function (next) {
//   try {
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("Product", ProductSchema);
