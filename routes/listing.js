const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schemaValidation");
const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");

let validating = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

//*index route
router.get("/", async (req, res) => {
  let data = await Listing.find({});
  res.render("listings/index.ejs", { data });
});

//*add route
router.post(
  "/",
  validating,
  asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  }),
);

router.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});
//*show route
router.get(
  "/:id/show",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { data });
  }),
);

//*edit route
router.get(
  "/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
  }),
);
//*put route
router.put(
  "/:id",
  validating,
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
router.delete(
  "/:id",
  asyncWrap(async (req, res) => {
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

module.exports = router