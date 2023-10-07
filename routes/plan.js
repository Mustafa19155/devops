const express = require("express");
const planController = require("../controllers/plan");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const planRouter = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const currDate = req.body.createdAt;
    req.date = currDate;

    !fs.existsSync(`public/plans/${currDate}`) &&
      fs.mkdirSync(`public/plans/${currDate}`, { recursive: true });
    cb(null, "public/plans/" + currDate);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const upload = multer({ storage });

const type = upload.any([{ name: "image", maxCount: 10 }]);

planRouter.post("/", isAdmin, type, planController.createPlan);
planRouter.get("/", planController.getAllPlans);
planRouter.get("/:id", planController.getPlanById);
planRouter.put("/:id", isAdmin, type, planController.updatePlan);
planRouter.delete("/:id", isAdmin, planController.deletePlan);

module.exports = planRouter;
