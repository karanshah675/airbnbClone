const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const path = require("path");
const User = require("../models/user");
const passport = require("passport");
const { redUrl } = require("../loginMiddleware");
router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});
router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/signup",
  asyncWrap(async (req, res, next) => {
    try {
      let { username, password, email } = req.body.user;
      let fakeUser = {
        email: email,
        username: username,
      };

      let data = await User.register(fakeUser, password);
      req.login(data, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to airbnb");
        res.redirect("/listing");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
    //   res.send(data);
  }),
);
router.post(
  "/login",
  redUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async(req, res) => {
    req.flash("success", "welcome back to airbnb");
    let redirectPath = res.locals.redirectUrl || "/listing"
    res.redirect(redirectPath);
  },
);
//*logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    console.log(err);
  });
  req.flash("success", "you logged out successfully");
  res.redirect("/listing");
});
module.exports = router;
