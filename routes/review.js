const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const {
  logedin,
  isreviewowner,
  logedindeletereview,
} = require("../middleware");
const reviewcontrol = require("../controllers/review");

function validatereview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
}

//review route
//post request

router.post(
  "/listings/:id/review",
  logedin,
  validatereview,
  wrapAsync(reviewcontrol.post)
);

//delete review

router.delete(
  "/listings/:id/reviews/:reviewid",
  logedindeletereview,
  isreviewowner,
  wrapAsync(reviewcontrol.delete)
);

module.exports = router;
