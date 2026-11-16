const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const asyncWrap = require("../utils/wrapAsync");
const passport = require("passport");
const { redUrl } = require("../loginMiddleware");

router
  .route("/signup")
  .get(userController.signupForm)
  .post(asyncWrap(userController.signupUser));
router
  .route("/login")
  .get(userController.loginForm)
  .post(
    redUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser,
  );
//*logout
router.get("/logout", userController.logoutUser);
module.exports = router;
