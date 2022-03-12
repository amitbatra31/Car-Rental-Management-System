const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/bookings", (req, res) => {
  res.render("bookings");
});
app.get("/rent", (req, res) => {
  res.render("rent");
});
app.listen(PORT, function (req, res) {
  console.log("Server is running on port " + PORT);
});
