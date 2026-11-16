const Listing = require("../models/listing");
const Review = require("../models/reviews");
module.exports.addReview = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);
  let rev = await new Review(req.body.review);
  // await Listing.findByIdAndUpdate(id, Listing.reviews.push(r1));
  rev.author = req.user._id;
  listing.reviews.push(rev);
  await rev.save();
  await listing.save();
  req.flash("success", "review saved");
  res.redirect("/listing");
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!res.locals.currUser._id.equals(review.author._id)) {
    req.flash("error", "permission is denied");
    return res.redirect(`/listing/${id}/show`);
  }
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "review deleted");
  res.redirect(`/listing/${id}/show`);
};
