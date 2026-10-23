const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const asyncWrap = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");
const { listingSchema } = require("./schemaValidation");
app.use(methodOverride("_method"));
mongoose
  .connect("mongodb://127.0.0.1:27017/airBnb")
  .then((res) => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

let validating = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

//*index route
app.get("/listing", async (req, res) => {
  let data = await Listing.find({});
  res.render("listings/index.ejs", { data });
});

//*add route
app.post(
  "/listing",
  validating,
  asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  }),
);

app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});
//*show route
app.get(
  "/listing/:id/show",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("listings/show.ejs", { data });
  }),
);

//*edit route
app.get(
  "/listing/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
  }),
);
//*put route
app.put(
  "/listing/:id",validating,
  asyncWrap((req, res) => {
    let { id } = req.params;
    let { title, discription, image, price, location, country } = req.body;
    Listing.findByIdAndUpdate(id, {
      title: title,
      discription: discription,
      price: price,
      location: location,
      country: country,
      image: image,
    })
      .then((res2) => {
        console.log("data updated");
        res.redirect("/listing");
      })
      .catch((err) => {
        console.log(err);
      });
  }),
);

//*delete route
app.delete(
  "/listing/:id",
  asyncWrap((req, res) => {
    let { id } = req.params;
    Listing.findByIdAndDelete(id)
      .then((res2) => {
        console.log("data deleted");
        res.redirect("/listing");
      })
      .catch((err) => {
        console.log(err);
      });
  }),
);
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
