const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.post = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  // console.log( newreview.author );
  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  console.log("review saved");
  req.flash("success", "New review created!!");
  if (!listing) {
    req.flash("error", " review does not exists !!");
    res.redirect("/listings");
  }
  res.redirect(`/listings/${listing.id}`);
};

module.exports.delete = async (req, res) => {
  let { id, reviewid } = req.params;
  //$pull is mongo operator like &in etc
  //which help us to remove an existing array all instances of a value of values which match a specified condition
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } }); //this line is done for delete reviews from listingdb
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "review deleted!!");
  res.redirect(`/listings/${id}`);
};
