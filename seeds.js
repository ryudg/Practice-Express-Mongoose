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

// const p = new Product({
//   name: "Ruby Grapefruit",
//   price: 1.99,
//   category: "fruit",
// });

// p.save()
//   .then((p) => {
//     console.log(p);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
