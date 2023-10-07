const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  plan: {
    discountUsed: {
      type: Boolean,
      default: true,
    },
    planID: {
      type: mongoose.Types.ObjectId,
      ref: "Plan",
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    expires: {
      type: Date,
      default: Date.now(),
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
  },
  deliveryAddress: {},
});

UserSchema.pre("updateOne", async function (next) {
  const data = this;
  console.log(data);
});

UserSchema.post("save", async (doc) => {
  try {
    await mongoose.model("Cart").create({
      userID: doc._id,
      products: [],
      total: 0,
    });
  } catch (err) {}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
