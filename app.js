if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
} //jab production phase me pauuchenge tab ham env ko nhi use kar rehehonge

// require('dotenv').config()
// console.log(process.env.SECRET) //npm i dotenv this help us to manage our secret code of cloud storage
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //ejs-mate
const Mess = require("./models/mess");
const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing");
const user = require("./routes/user");
const review = require("./routes/review");
const session = require("express-session"); //npm i express-session
const flash = require("connect-flash"); // npm i connect-flash
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const wrapAsync = require("./utils/wrapAsync");

// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

//use seession

const sessionoption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("hi i am root");
});

app.use(session(sessionoption));
app.use(flash());
//for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user; //this local is use to send data of user login in navbar.ejs
  next();
});

app.use("/listings", listings);
app.use("/", user);
app.use("/", review);

//for mess
app.get(
  "/mess",
  wrapAsync(async (req, res) => {
    let allmess = await Mess.find();
    res.render("listings/mess.ejs", { allmess });
  })
);

//mess show
app.get(
  "/mess/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let mess = await Mess.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!mess) {
      req.flash("error", " mess does not exists !!");
      res.redirect("/mess");
    }
    console.log(mess);
    res.render("listings/showmess.ejs", { mess });
  })
);

//new mess


// page not found
//"*" => iska mtlb phale woo sabhi route se check karega agar koi bhi upar wala route match nhi hoga tabb ye expresserroer ko call karega
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!!"));
});

//error handeling express midilware
app.use((err, req, res, next) => {
  let { status = 500, message = " some thing went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

//for schema vaidation install npm i joi

app.listen(8080, (req, res) => {
  console.log("port is listening on 8080");
});
