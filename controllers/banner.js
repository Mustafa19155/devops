const Banner = require("../models/banner");
const fs = require("fs");

exports.getBanner = async (req, res, next) => {
  try {
    const { type } = req.query;

    const banner = await Banner.findOne({ type });

    if (!banner) {
      return res.status(404).send("Banner not found");
    }

    res.json(banner);
  } catch (err) {
    next(err);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const { type } = req.params;

    const bannerFound = await Banner.findOne({ type });

    if (bannerFound) {
      const files = req.files;

      if (files.length > 0) {
        try {
          files.map((file, index) => {
            let filePath = bannerFound.image[index].split("/");
            if (
              !files.some(
                (file) => file.originalname == filePath[filePath.length - 1]
              )
            ) {
              fs.rmSync(`public/${filePath.join("/")}`, { recursive: true });
            }
          });
        } catch (err) {}
      }

      const imagesArray = [];

      files.map((file) => {
        imagesArray.push(
          file.destination.split("/")[1] +
            "/" +
            file.destination.split("/")[2] +
            "/" +
            file.filename
        );
      });

      bannerFound.image = files.length > 0 ? imagesArray : bannerFound.image;

      // bannerFound.images =
      //   files.length > 0
      //     ? req.files[0].destination.split("/")[1] +
      //       "/" +
      //       req.files[0].destination.split("/")[2] +
      //       "/" +
      //       req.files[0].filename
      //     : bannerFound.image;

      await bannerFound.save();

      return res.status(200).json(bannerFound);
    } else {
      const file = req.files[0];

      const data = { type };

      data["image"] =
        file.destination.split("/")[1] +
        "/" +
        file.destination.split("/")[2] +
        "/" +
        file.filename;

      const banner = await Banner.create(data);

      res.status(201).json(banner);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
