const Review = require("../models/review");

exports.createReview = async (req, res, next) => {
  try {
    const { data } = req.body;
    const review = await Review.create(data);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.getReviewsForProduct = async (req, res, next) => {
  try {
    const { productID } = req.params;
    const reviews = await Review.find({ productID: productID });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
