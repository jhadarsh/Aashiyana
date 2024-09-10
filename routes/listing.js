const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Listing = require("../models/listing");
const { logedin, isowner } = require("../middleware");
const listingcontrol = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudconfigure");
const upload = multer({ storage });
//npm i multer is a npm package use to read the files

const validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// index route
router.get("/", wrapAsync(listingcontrol.index));

//new route

router.get("/new", logedin, wrapAsync(listingcontrol.new));

//show route
router.get("/:id", wrapAsync(listingcontrol.show)); 

//create route
router.post("/",upload.single("listing[image]"), validatelisting, wrapAsync(listingcontrol.create));


//edit route
router.get("/:id/edit", logedin, isowner, wrapAsync(listingcontrol.edit));

//update route

router.put("/:id", isowner,upload.single("listing[image]"), validatelisting , wrapAsync(listingcontrol.update));

//delete route

router.delete("/:id", logedin, isowner, wrapAsync(listingcontrol.delete));

module.exports = router;
