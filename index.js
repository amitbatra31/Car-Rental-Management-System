const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const session = require("express-session");
const passport = require("passport");
const { cars } = require("./db/cars");
const passportLocalMongoose = require("passport-local-mongoose");
const PORT = process.env.PORT || 3000;
require("dotenv").config();
app.use(express.static("public"));

app.use(
  session({
    secret: "This is a secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const connectDB = async () => {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/crmsDB",
    {
      useNewUrlParser: true,
    },
    (err) => {
      if (err) console.log(err);
      else console.log("connected to mongoDB");
    }
  );
};
connectDB();
const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    let currentUser;
    (async () => {
      currentUser = await User.findOne({ username: req.user.username });
      console.log(currentUser);
      res.render("home", { signedIN: true, usrDetails: currentUser });
    })();
  } else {
    res.render("home", { signedIN: false, usrDetails: null });
  }
});
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    let currentUser;
    (async () => {
      currentUser = await User.findOne({ username: req.user.username });
      console.log(currentUser);
      res.render("login", { signedIN: true, usrDetails: currentUser });
    })();
  } else {
    res.render("login", { signedIN: false, usrDetails: null });
  }
});
app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    let currentUser;
    (async () => {
      currentUser = await User.findOne({ username: req.user.username });
      console.log(currentUser);
      res.render("register", { signedIN: true, usrDetails: currentUser });
    })();
  } else {
    res.render("register", { signedIN: false, usrDetails: null });
  }
});
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});
app.post("/register", (req, res) => {
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.register({ username: username }, password, (err, user) => {
    if (err || confirmPassword !== password) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});
app.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/bookings", (req, res) => {
  if (req.isAuthenticated()) {
    let currentUser;
    (async () => {
      currentUser = await User.findOne({ username: req.user.username });
      console.log(currentUser);
      res.render("bookings", { signedIN: true, usrDetails: currentUser });
    })();
  } else {
    res.render("bookings", { signedIN: false, usrDetails: null });
  }
});
app.get("/rent", (req, res) => {
  if (req.isAuthenticated()) {
    let currentUser;
    (async () => {
      currentUser = await User.findOne({ username: req.user.username });
      console.log(currentUser);
      res.render("rent", {
        signedIN: true,
        usrDetails: currentUser,
        cars: cars,
      });
    })();
  } else {
    res.render("rent", { signedIN: false, usrDetails: null, cars: cars });
  }
});
app.post("/book", (req, res) => {
  const id = req.body.id;
  console.log(id);
});
app.listen(PORT, function (req, res) {
  console.log("Server is running on port " + PORT);
});
