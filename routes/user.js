const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware");
const usercontrol = require("../controllers/user");

//signup

router.get("/signup", usercontrol.getsignup);

router.post("/signup", wrapAsync(usercontrol.postsignup));

//login
router.get("/login", usercontrol.getlogin);

router.post(
  "/login",
  saveredirecturl, //redirect middelware from middleware.ejs
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usercontrol.postlogin
);
//npm passport dovumentation lo padhna hai

//logout

router.get("/logout", usercontrol.logout);

module.exports = router;
