const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schemaValidation");
const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { isLoggedin, isOwner } = require("../loginMiddleware");
const listingController = require("../controllers/listing");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
let validating = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

router
  .route("/")
  .get(listingController.index)
  .post(upload.single('listing[image]'),(req, res) => {
    res.send(req.file);
  });
// .post(isLoggedin, validating, asyncWrap(listingController.addListing));
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
router
  .route("/:id")
  .put(
    isLoggedin,
    isOwner,
    validating,
    asyncWrap(listingController.editListing),
  )
  .delete(isLoggedin, isOwner, asyncWrap(listingController.deleteListing));

module.exports = router;
