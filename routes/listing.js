const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schemaValidation");
const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const path = require("path");
 
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
    req.flash("success", "new listing is created");
    res.redirect("/listing");
  }),
);

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});
//*show route
router.get(
  "/:id/show",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("reviews");
     if(!data){
      
      req.flash("error", "no listing");
    }
    res.render("listings/show.ejs", { data });
  }),
);

//*edit route
router.get(
  "/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if(!data){
      
      req.flash("error", "no listing");
    }
    req.flash("success", "listing edited");
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
    req.flash("success", "listing updated");

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
    req.flash("success", "listing deleted");
        console.log("data deleted");
        res.redirect("/listing");
      })
      .catch((err) => {
        console.log(err);
      });
  }),
);

module.exports = router;
