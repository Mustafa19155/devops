const SocialPost = require("../models/socialPost");
const fs = require("fs");
const path = require("path");

exports.createSocialPost = async (req, res, next) => {
  try {
    const data = req.body;

    const file = req.files[0];
    if (file) {
      data["image"] =
        file.destination.split("/")[1] +
        "/" +
        file.destination.split("/")[2] +
        "/" +
        file.filename;
    }
    const socialPosts = await SocialPost.find({ type: req.body.type });
    if (req.body.type == "instagram") {
      if (socialPosts.length >= 4) {
        return res.status(400).send("LIMIT REACHED");
      }
    } else {
      if (socialPosts.length >= 2) {
        return res.status(400).send("LIMIT REACHED");
      }
    }

    const socialPost = await SocialPost.create(data);

    res.status(201).json(socialPost);
  } catch (error) {
    next(error);
  }
};

exports.getAllSocialPosts = async (req, res, next) => {
  try {
    const socialPosts = await SocialPost.find();
    res.status(200).json(socialPosts);
  } catch (error) {
    next(error);
  }
};

exports.updateSocialPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { type, url } = req.body;

    const socialPost = await SocialPost.findById(id);

    if (!socialPost) {
      return res.status(404).json({ error: "Social Post not found" });
    }

    const files = req.files;

    if (files.length > 0) {
      try {
        let folderPath = socialPost.image.split("/");
        folderPath.pop();

        fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
      } catch (err) {}
    }

    socialPost.type = type;
    socialPost.url = url;
    socialPost.image =
      files.length > 0
        ? req.files[0].destination.split("/")[1] +
          "/" +
          req.files[0].destination.split("/")[2] +
          "/" +
          req.files[0].filename
        : socialPost.image;

    await socialPost.save();

    res.status(200).json(socialPost);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteSocialPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const socialPost = await SocialPost.findById(id);

    if (!socialPost) {
      return res.status(404).json({ error: "Social Post not found" });
    }

    try {
      let folderPath = socialPost.image.split("/");
      folderPath.pop();

      fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
    } catch (err) {}

    await SocialPost.deleteOne({ _id: socialPost._id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
