const Event = require("../models/event");
const fs = require("fs");
const path = require("path");

exports.createEvent = async (req, res, next) => {
  try {
    const data = req.body;

    const file = req.files[0];

    data["image"] =
      file.destination.split("/")[1] +
      "/" +
      file.destination.split("/")[2] +
      "/" +
      file.filename;

    const event = await Event.create(req.body);

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;

    const numberLimit = parseInt(limit) || 10;
    const numberSkip = parseInt(skip) || 0;

    const events = await Event.find()
      .limit(numberLimit)
      .skip(numberSkip)
      .sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, description, features, date, price, totalBookings } =
      req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const files = req.files;

    if (files.length > 0) {
      try {
        let folderPath = event.image.split("/");
        folderPath.pop();

        fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
      } catch (err) {}
    }

    event.title = title;
    event.totalBookings = totalBookings;
    event.description = description;
    event.features = features;
    event.date = date;
    event.price = price;
    event.image =
      files.length > 0
        ? req.files[0].destination.split("/")[1] +
          "/" +
          req.files[0].destination.split("/")[2] +
          "/" +
          req.files[0].filename
        : event.image;

    await event.save();

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    try {
      let folderPath = event.image.split("/");
      folderPath.pop();

      fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
    } catch (err) {}

    await Event.deleteOne({ _id: event._id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
