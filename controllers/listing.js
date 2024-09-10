const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  let { college } = req.query;
  if (college == undefined) {
    let allListiings = await Listing.find({});
    res.render("listings/index.ejs", { allListiings });
  } else {
    let allListiings = await Listing.find({ college: `${college}` });
    res.render("listings/index.ejs", { allListiings }); 
  }
};

module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", " listing does not exists !!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.create = async (req, res, next) => {
  // jab user listing karne ke liye koi data he nhi bhej raha hoga tab ye error aiega
  if (!req.body.listing) {
    throw new ExpressError(400, "listing data is not avaialble");
  }
  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user.id; //owner ke information save
  newlisting.image = { url, filename };
  await newlisting.save();
  console.log("save");
  req.flash("success", "New listing created!!");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " listing does not exists !!");
    res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "listing data is not avaialble");
  }
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", " listing updated!!");

  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted!!");
  if (!listing) {
    req.flash("error", " listing does not exists !!");
    res.redirect("/listings");
  }
  res.redirect("/listings");
};
//MVC framework ko resume me major project ke feature me add kar sakte ahi
