const User = require("../models/user");

module.exports.signupUser = async (req, res, next) => {
  try {
    let { username, password, email } = req.body.user;
    let userData = {
      email: email,
      username: username,
    };

    let data = await User.register(userData, password);
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
};

module.exports.signupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.loginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "welcome back to airbnb");
  let redirectPath = res.locals.redirectUrl || "/listing";
  res.redirect(redirectPath);
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    console.log(err);
  });
  req.flash("success", "you logged out successfully");
  res.redirect("/listing");
};
