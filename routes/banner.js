const express = require("express");
const bannerController = require("../controllers/banner");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const bannerRouter = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const typeofBanner = req.params.type;

    !fs.existsSync(`public/banners/${typeofBanner}`) &&
      fs.mkdirSync(`public/banners/${typeofBanner}`, { recursive: true });
    cb(null, "public/banners/" + typeofBanner);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const upload = multer({ storage });

const type = upload.any([{ name: "image", maxCount: 10 }]);

bannerRouter.get("/", bannerController.getBanner);
bannerRouter.put("/:type", isAdmin, type, bannerController.updateBanner);

module.exports = bannerRouter;
