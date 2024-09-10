const User = require("../models/user");

module.exports.getsignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postsignup = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    const newuser = new User({ email, username });
    const registeruser = await User.register(newuser, password);
    console.log(registeruser);
    req.login(registeruser, (error) => {
      //build in login function in passport read documentation
      if (error) {
        return next(error);
      }
      req.flash("success", "Welcome to WonderLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.getlogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postlogin = async (req, res) => {
  req.flash("success", "Welcome back to WonderLust!!");
  let redirecturl = res.locals.redirectUrl || "/listings"; //new redirect url
  res.redirect(redirecturl);
};

module.exports.logout = (req, res, next) => {
  req.logout((error) => {
    //built in function in passport to logout read documentation.logout
    if (error) {
      return next();
    }
    req.flash("success", "You are loged out !!");
    res.redirect("/listings");
  });
};
