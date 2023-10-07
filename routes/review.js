const express = require("express");
const reviewController = require("../controllers/review");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const reviewRouter = express.Router();

reviewRouter.post("/", checkAuth, reviewController.createReview);
// reviewRouter.get("/", reviewController.getAllReviews);
reviewRouter.get("/:productID", reviewController.getReviewsForProduct);
reviewRouter.put("/:id", checkAuth, reviewController.updateReview);
reviewRouter.delete("/:id", checkAuth, reviewController.deleteReview);

module.exports = reviewRouter;
