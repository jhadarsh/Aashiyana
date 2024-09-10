const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.logedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You have to login to create new listing!!");
    return res.redirect("/login");
  }
  next();
};

module.exports.logedindeletereview = (req, res, next) => {
  let { id } = req.params;
  if (!req.isAuthenticated()) {
    
    req.flash("error", "You have to login to delete your review!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


module.exports.saveredirecturl = (req,res,next) =>{
    if ( req.session.redirectUrl) {
      // console.log(req.session.redirectUrl);
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isowner = async (req,res,next)=>{
  let { id } = req.params;
  let listing =  await Listing.findById(id);
  if ( !listing.owner.equals(res.locals.currentuser._id)) {
    req.flash("error","You are not the OWNER of this listing");
     return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isreviewowner = async (req,res,next)=>{
  let { id, reviewid } = req.params;
  let review=  await Review.findById(reviewid);
  if ( !review.author.equals(res.locals.currentuser._id)) {
    req.flash("error","You are not the OWNER of this review!!");
     return res.redirect(`/listings/${id}`);
  }
  next();
};