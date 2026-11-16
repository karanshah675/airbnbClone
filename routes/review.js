const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema, reviewSchema } = require("../schemaValidation");
const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { isLoggedin } = require("../loginMiddleware");
const reviewController = require("../controllers/review");

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
  isLoggedin,
  validatingReview,
  asyncWrap(reviewController.addReview),
);
//*delete review
router.delete("/:reviewId", isLoggedin, reviewController.deleteReview);

module.exports = router;
