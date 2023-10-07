const express = require("express");
const eventController = require("../controllers/event");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const eventRouter = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const currDate = req.body.createdAt;
    req.date = currDate;

    !fs.existsSync(`public/events/${currDate}`) &&
      fs.mkdirSync(`public/events/${currDate}`, { recursive: true });
    cb(null, "public/events/" + currDate);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const upload = multer({ storage });

const type = upload.any([{ name: "image", maxCount: 10 }]);

eventRouter.post("/", isAdmin, type, eventController.createEvent);
eventRouter.get("/", eventController.getAllEvents);
eventRouter.get("/:id", eventController.getEventById);
eventRouter.put("/:id", isAdmin, type, eventController.updateEvent);
eventRouter.delete("/:id", isAdmin, eventController.deleteEvent);

module.exports = eventRouter;
