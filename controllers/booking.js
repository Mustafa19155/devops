const Booking = require("../models/booking");

exports.createBooking = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const data = req.body;

    const { id } = req.params;

    data["eventID"] = id;
    data["userID"] = _id;

    const booking = await Booking.create(data);

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getBookingsByEventId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.find({ eventID: id }).populate("eventID");

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
