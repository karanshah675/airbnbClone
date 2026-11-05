const express = require("express");
const mongoose = require("mongoose");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schemaValidation");
const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const Review = require("../models/reviews");



let validatingReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};



//*add review
router.post(
  "/",
  validatingReview,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let rev = await new Review(req.body.review);
    // await Listing.findByIdAndUpdate(id, Listing.reviews.push(r1));
    listing.reviews.push(rev);
    await rev.save();
    await listing.save();
    req.flash("success","review saved")
    res.redirect("/listing");
  }),
);
//*delete review
router.delete("/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success","review deleted")
  res.redirect(`/listing/${id}/show`);
});

module.exports = router