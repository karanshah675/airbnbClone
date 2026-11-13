const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let data = await Listing.find({});
  res.render("listings/index.ejs", { data });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showPage = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("error", "no listing");
  }
  res.render("listings/show.ejs", { data });
};

module.exports.addListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "new listing is created");
  res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "no listing");
  }
  req.flash("success", "listing edited");
  res.render("listings/edit.ejs", { data });
};

module.exports.editListing = (req, res) => {
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
};

module.exports.deleteListing = async (req, res) => {
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
};
