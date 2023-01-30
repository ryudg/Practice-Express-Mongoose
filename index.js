const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const Product = require("./models/product");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://localhost:27017/farmStand")
  .then(() => {
    console.log("MogoDB Connection Open!!!");
  })
  .catch((err) => {
    console.log("MogoDB ERROR!!!!!!!!!!!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/dog", (req, res) => {
  res.send("WOOOOOF!!!!!");
});

app.listen(3133, () => console.log("APP IS OPENED"));
