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
  let url = req.file.path;
  let path = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //because of passport
  newListing.image = { url, path };
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
  let newUrl = data.image.url.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { data,newUrl });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let url = req.file.path;
  let path = req.file.filename;
  // let { title, discription, image, price, location, country } = req.body;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file !== "undefined") {
    listing.image.url = url;
    listing.image.path = path;
    await listing.save();
  }
  req.flash("success", "listing edited");
  res.redirect(`/listing/${id}/show`);
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
