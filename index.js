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

app.get("/products", async (req, res) => {
  const products = await Product.find({}); // 모든 데이터 조회, 조회하는 시간이 필요하기 때문에 이 라우터에 비동기 핸들러를 만들기
  res.render("products/index", { products });
});

app.listen(3133, () => console.log("APP IS OPENED"));
