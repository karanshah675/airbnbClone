const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schemaValidation");
const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { isLoggedin, isOwner } = require("../loginMiddleware");
const listingController = require("../controllers/listing");

let validating = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

//*index route
router.get("/", listingController.index);

//*add route
router.post(
  "/",
  isLoggedin,
  validating,
  asyncWrap(listingController.addListing),
);
//*new route
router.get("/new", isLoggedin, listingController.renderNewForm);
//*show route
router.get("/:id/show", asyncWrap(listingController.showPage));

//*edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  asyncWrap(listingController.renderEditForm),
);
//*put route
router.put(
  "/:id",
  isLoggedin,
  isOwner,
  validating,
  asyncWrap(listingController.editListing),
);

//*delete route
router.delete(
  "/:id",
  isLoggedin,
  isOwner,
  asyncWrap(listingController.deleteListing),
);
