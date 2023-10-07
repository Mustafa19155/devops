const Plan = require("../models/plan");
const path = require("path");
const fs = require("fs");

exports.createPlan = async (req, res, next) => {
  try {
    const data = req.body;

    const file = req.files[0];

    data["image"] =
      file.destination.split("/")[1] +
      "/" +
      file.destination.split("/")[2] +
      "/" +
      file.filename;

    const plan = await Plan.create(req.body);

    res.status(201).json(plan);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};

exports.getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, description, features, duration, price, discount } =
      req.body;

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const files = req.files;

    if (files.length > 0) {
      try {
        let folderPath = plan.image.split("/");
        folderPath.pop();

        fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
      } catch (err) {}
    }

    plan.title = title;
    plan.description = description;
    plan.features = features;
    plan.duration = duration;
    plan.price = price;
    plan.discount = discount;
    plan.image =
      files.length > 0
        ? req.files[0].destination.split("/")[1] +
          "/" +
          req.files[0].destination.split("/")[2] +
          "/" +
          req.files[0].filename
        : plan.image;

    await plan.save();

    res.status(200).json(plan);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    try {
      let folderPath = plan.image.split("/");
      folderPath.pop();

      fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
    } catch (err) {}

    await Plan.deleteOne({ _id: plan._id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
