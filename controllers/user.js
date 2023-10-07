const Plan = require("../models/plan");
const User = require("../models/user");
const Payment = require("../models/payment");

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const validPassword = bcrypt.compare(password, user.password);

    if (validPassword) {
      if (user.plan.planID) {
        const currDate = new Date();
        currDate.setHours(0, 0, 0, 0);
        const expiryDate = new Date(user.plan.expires);
        expiryDate.setHours(0, 0, 0, 0);

        if (currDate > expiryDate) {
          user.plan.planID = null;
          await user.save();
        }
      }

      next();
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    if (user) {
      return res.json({ user });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
};
module.exports.logout = async (req, res, next) => {
  try {
    req.logout(() => {
      req.logout(function (err) {
        if (err) {
          return res.status(500).send("error logging out");
        }
        return res.send("Done");
      });
    });
  } catch (err) {
    next(err);
  }
};
module.exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.user) {
      return res.json({ user: req.user });
    } else {
      return res.status(400).send("not logged in");
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id: _id });
    res.send(user);
  } catch (err) {
    next(err);
  }
};
module.exports.updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { oldPassword, newPassword, username, deliveryAddress } = req.body;

    const user = await User.findOne({ _id: _id });

    if (oldPassword && newPassword) {
      if (user.googleId) {
        return res.status(400).send("Account is connected with google");
      }
      const validPass = await bcrypt.compare(oldPassword, user.password);
      if (!validPass) {
        return res.status(400).send("Invalid Password");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user["password"] = hashedPassword;
    }

    if (username) {
      user["username"] = username;
    }

    if (deliveryAddress) {
      user["deliveryAddress"] = deliveryAddress;
    }

    await user.save();

    res.send(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.updatePlan = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { planId } = req.params;

    const user = await User.findById(_id);
    const plan = await Plan.findById(planId);

    if (user.plan.planID && user.plan.planID == planId) {
      return res.status(400).send("Plan is already active");
    } else {
      user.plan.discountUsed = false;
      const duration = plan.duration;
      const currDate = new Date();

      user.plan.planID = mongoose.Types.ObjectId(planId);

      currDate.setFullYear(currDate.getFullYear() + duration);

      await Payment.create({
        userID: req.user._id,
        planID: planId,
      });

      user.plan.expires = currDate;

      await user.save();

      return res.json({ plan, expires: currDate });
    }
  } catch (err) {
    next(err);
  }
};
