const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

app.get("/products", async (req, res) => {
  const { category } = req.query; // req.query에서 카테고리를 찾은 후 있다면
  if (category) {
    const products = await Product.find({ category }); // 카테고리 페이지로
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({}); // 모든 데이터 조회, 조회하는 시간이 필요하기 때문에 이 라우터에 비동기 핸들러를 만들기
    res.render("products/index", { products, category: "All" });
  }
});

// 상품 추가 form input 페이지
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});
// 추가한 상품 정보 제출
app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body); // 유효성 검사를 하지 않으니 req.body에 포함된 정보 중 나타나서는 안되는 추가적인 정보를 확인할 수 없다
  await newProduct.save();
  res.redirect(`products/${newProduct._id}`); // newProduct._id 언더스코어 Mongoose로부터 실제 정보를 받았을 때만 작동
});

// 상품 상세 정보 페이지
// URL을 안전하게 만드는 웹 Slug
// id는 Mongo ID 사용 - "Slug"는 일반적으로 이미 얻은 데이터를 사용하여 유효한 URL을 생성하는 방법
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

// 개별 상품 업데이트하기
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true, // default 유효성 검사
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});

// 상품 정보 삭제
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

app.listen(3133, () => console.log("APP IS OPENED"));
