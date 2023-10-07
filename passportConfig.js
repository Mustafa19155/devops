const LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth2").Strategy;

const User = require("./models/user");
const bcrypt = require("bcryptjs");

exports.initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const foundUser = await User.findOne({ email: email }).populate(
            "plan.planID"
          );

          if (!foundUser) {
            return done(null, false, { message: "User does not exist" });
          } else {
            if (foundUser.googleId) {
              return done(null, false, {
                message:
                  "This account is linked with google. Try logging in with google",
              });
            }
            const validPass = await bcrypt.compare(
              password,
              foundUser.password
            );
            if (!validPass) {
              return done(null, false, { message: "Incorrect password" });
            } else {
              return done(null, foundUser);
            }
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, cb) {
        let foundUser = await User.findOne({ email: profile.email }).populate(
          "plan.planID"
        );

        if (foundUser) {
          if (foundUser) {
            if (!foundUser.isVerified) {
              foundUser.googleId = profile.id;
              foundUser.isVerified = profile.email_verified;
              await foundUser.save();
            }
          }

          return cb(null, foundUser);
        } else {
          const data = {
            username: profile.displayName,
            isVerified: profile.email_verified,
            email: profile.email,
            googleId: profile.id,
          };
          const user = new User(data);
          user.save((error, registeredUser) => {
            if (error) {
              return cb(error, null);
            } else {
              return cb(null, registeredUser);
            }
          });
        }
      }
    )
  );

  passport.serializeUser(async (user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).populate("plan.planID");
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
};
