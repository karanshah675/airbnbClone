const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const session = require("express-session");
mongoose
  .connect("mongodb://127.0.0.1:27017/airBnb")
  .then((res) => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });
let sessionOption = {
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  },
};
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
// app.use(session(sessionOption));

app.use("/listing", listings);
app.use("/listing/:id/review", reviews);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server started");
});
