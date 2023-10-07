var express = require("express");
const authController = require("../controllers/user");
const passport = require("passport");

const userRouter = express.Router();

userRouter.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, foundUser, info) {
    if (err) {
      return next(err);
    }
    if (!foundUser) {
      return res.status(400).send(info.message);
    }

    req.logIn(foundUser, function (err) {
      if (err) {
        return next(err);
      }
      return res.send(foundUser);
    });
  })(req, res, next);
});

userRouter.get("/admin", authController.getUser);
userRouter.put("/", authController.updateUser);
userRouter.put("/single", authController.updateUser);
userRouter.post("/register", authController.register);
userRouter.post("/logout", authController.logout);
userRouter.post(
  "/plan/:planId",

  authController.updatePlan
);
userRouter.get(
  "/isLoggedIn",

  authController.isLoggedIn
);

module.exports = userRouter;
