const express = require("express");
const socialPostController = require("../controllers/socialPost");

const multer = require("multer");
const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const currDate = req.body.createdAt;

    req.date = currDate;

    !fs.existsSync(`public/socialPosts/${currDate}`) &&
      fs.mkdirSync(`public/socialPosts/${currDate}`, { recursive: true });
    cb(null, "public/socialPosts/" + currDate);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const upload = multer({ storage });

const type = upload.any([{ name: "image", maxCount: 10 }]);

const socialPostRouter = express.Router();

socialPostRouter.post(
  "/",
  isAdmin,
  type,
  socialPostController.createSocialPost
);
socialPostRouter.get("/", socialPostController.getAllSocialPosts);
socialPostRouter.put(
  "/:id",
  isAdmin,
  type,
  socialPostController.updateSocialPost
);
socialPostRouter.delete("/:id", isAdmin, socialPostController.deleteSocialPost);

module.exports = socialPostRouter;
