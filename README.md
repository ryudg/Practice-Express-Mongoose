# Mongoose와 Express 통합 개발

- 폴더를 분리해서 models 디렉터리를 만들어서 Model 관리
  - 일반적인 어플리케이션에서는 방대한 양의 모델이 있는데 하나의 파일에서 관리하기가 어려움
  - 특히 모델들이 서로를 참조하기 때문에 파일을 분리해서 관리하는게 유지보수에 유리함
  
## `./models/product.js` 에서 상품 스키마 정의 후 `export`
```javascript
// ... product.js

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

## `index.js`에서 product 정보 `require`
// ... index.js

...

const Product = require("./models/product");
```

# seed 파일
- seed는 서버가 시작될 때 애플리케이션이 가지고 있어야 할 정적인 데이터들을 DB에 추가해주는 기능을 의미
- 데이터 삽입
```javascript
// ... seed.js

...

const p = new Product({
  name: "Ruby Grapefruit",
  price: 1.99,
  category: "fruit",
});

p.save()
  .then((p) => {
    console.log(p);
  })
  .catch((e) => {
    console.log(e);
  });
```
- 삽입 데이터 확인
```bash
> node seeds.js
MogoDB Connection Open!!!
{
  name: 'Ruby Grapefruit',
  price: 1.99,
  category: 'fruit',
  _id: new ObjectId("63d7c3ddf1e423f3d667883c"),
  __v: 0
}
```
```bash
## Mongo Shell
> use farmStand
switched to db farmStand
> show collections
products
> db.products.find().pretty()
{
        "_id" : ObjectId("63d7c3ddf1e423f3d667883c"),
        "name" : "Ruby Grapefruit",
        "price" : 1.99,
        "category" : "fruit",
        "__v" : 0
}
```
- 다수의 데이터  삽입하기
```javascript
const seedProducts = [...];

// insertMany를 사용할 때 하나라도 유효성 검사를 통과하지 못하면 아무것도 삽입되지 않음에 주의!
Product.insertMany(seedProducts)
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
```
- 삽입 데이터 확인
```bash
> node seeds.js
MogoDB Connection Open!!!
[
  {
    name: 'Fairy Egglant',
    price: 1,
    category: 'vegetable',
    _id: new ObjectId("63d7ce06fa47c1f0851d61c4"),
    __v: 0
  },
  {
    name: 'Organic Goddess Melon',
    price: 4.99,
    category: 'fruit',
    _id: new ObjectId("63d7ce06fa47c1f0851d61c5"),
    __v: 0
  },
  {
    name: 'Organic Mini Seedless Watermelon',
    price: 3.99,
    category: 'fruit',
    _id: new ObjectId("63d7ce06fa47c1f0851d61c6"),
    __v: 0
  },
  {
    name: 'Organic Celery',
    price: 1.5,
    category: 'vegetable',
    _id: new ObjectId("63d7ce06fa47c1f0851d61c7"),
    __v: 0
  },
  {
    name: 'Chocolate Whole Milk',
    price: 2.69,
    category: 'dairy',
    _id: new ObjectId("63d7ce06fa47c1f0851d61c8"),
    __v: 0
  }
]
```

```bash
## Mongo Shell
> db.products.find().pretty()
{
        "_id" : ObjectId("63d7c3ddf1e423f3d667883c"),
        "name" : "Ruby Grapefruit",
        "price" : 1.99,
        "category" : "fruit",
        "__v" : 0
}
{
        "_id" : ObjectId("63d7ce06fa47c1f0851d61c4"),
        "name" : "Fairy Egglant",
        "price" : 1,
        "category" : "vegetable",
        "__v" : 0
}
{
        "_id" : ObjectId("63d7ce06fa47c1f0851d61c5"),
        "name" : "Organic Goddess Melon",
        "price" : 4.99,
        "category" : "fruit",
        "__v" : 0
}
{
        "_id" : ObjectId("63d7ce06fa47c1f0851d61c6"),
        "name" : "Organic Mini Seedless Watermelon",
        "price" : 3.99,
        "category" : "fruit",
        "__v" : 0
}
{
        "_id" : ObjectId("63d7ce06fa47c1f0851d61c7"),
        "name" : "Organic Celery",
        "price" : 1.5,
        "category" : "vegetable",
        "__v" : 0
}
{
        "_id" : ObjectId("63d7ce06fa47c1f0851d61c8"),
        "name" : "Chocolate Whole Milk",
        "price" : 2.69,
        "category" : "dairy",
        "__v" : 0
}
```
# RESTful하게 웹 페이지 구축하기

## 모든 데이터 조회
- 조회하는 시간이 필요하기 때문에 이 라우터에 비동기 핸들러를 만들기
```javascript

...

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});
```
# ejs 템플릿 엔진을 사용해 화면에 출력하기

```html
// views/products/index.ejs

...

<ul>
  <% for (const product of products) { %>
  <li><%= product.name %></li>
  <% } %>
</ul>
```

