const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = {
  createJWT: async (req, res) => {
    const token = jwt.sign({ user_id: req.userId }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { access_token: token }
    );

    // res.setHeader(
    //   "Set-Cookie",
    //   `access_token=${token}; HttpOnly; SameSite=none; secure=false`
    // );

    res.json({
      status: 200,
      message: "Success",
      access_token: token,
      user: {
        isAdmin: user.isAdmin,
        email: user.email,
        username: user.username,
        plan: user.plan,
      },
    });

    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "none",
    //   })
    //   .json({ status: 200, message: "Success", access_token: token });
  },
  verifyJWT: async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    // const token = req.cookies.access_token;

    if (!token) {
      res.status(401).send("Unauthorized");
    } else {
      try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = data.user_id;

        next();
      } catch (err) {
        res.status(401).send("Unauthorized");
      }
    } // Almost done
  },
};
module.exports = authMiddleware;
