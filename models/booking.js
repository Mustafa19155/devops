const mongoose = require("mongoose");
const Event = require("./event");
const Payment = require("./payment");

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    eventID: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    persons: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

BookingSchema.pre("save", async function (next) {
  try {
    const booking = this;
    Payment.create({
      userID: booking.userID,
      bookingID: booking._id,
    });

    console.log(this);
    const event = await Event.findById(booking.eventID);

    event.totalBookings -= 1;
    await event.save();

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
