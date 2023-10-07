const express = require("express");
const bookingController = require("../controllers/booking");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const bookingRouter = express.Router();

bookingRouter.post("/:id", bookingController.createBooking);
bookingRouter.get("/", isAdmin, bookingController.getAllBookings);
bookingRouter.get("/:id", bookingController.getBookingsByEventId);
// bookingRouter.put("/:id", bookingController.updateBooking);
// bookingRouter.delete("/:id", bookingController.deleteBooking);

module.exports = bookingRouter;
