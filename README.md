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

## seed 파일
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
## ejs 템플릿 엔진을 사용해 화면에 출력하기

```html
// views/products/index.ejs

...

<ul>
  <% for (const product of products) { %>
  <li><%= product.name %></li>
  <% } %>
</ul>
```
## `READ` 상세정보 페이지 만들기
```javascript
// ... index.js

... 

// 상품 상세 정보
// URL을 안전하게 만드는 웹 Slug
// id는 Mongo ID 사용 - "Slug"는 일반적으로 이미 얻은 데이터를 사용하여 유효한 URL을 생성하는 방법
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});
```
- `http://localhost:3133/products/63d7c3ddf1e423f3d667883c`와 같이 Mongo ID를 이용해 접속

## `CREATE` 상품 추가 페이지 만들기
```javascript
// ... index.js

...

// 상품 추가 form input 페이지
app.get("/products/new", (req, res) => {
  res.render("products/new");
});

// 추가한 상품 정보 제출
app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body); // 유효성 검사를 하지 않으니 req.body에 포함된 정보 중 나타나서는 안되는 추가적인 정보를 확인할 수 없다
  await newProduct.save();
  res.redirect(`products/${newProduct._id}`);   // newProduct._id 언더스코어 Mongoose로부터 실제 정보를 받았을 때만 작동
});
```

## `UPDATE` 개별 상품 업데이트하기
- PUT 요청은 PATCH 요청과 달리 객체를 재정의하거나 교체할 때 사용하고
- PATCH 요청은 문서나 객체의 일부를 변경할 때 사용

- form Method를 PUT으로 할 수 없기 때문에 `method-override` 설치
```bash
> npm i method-override
```
```javascript
// ... index.js

...

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
```
```html
<!-- edit.ejs -->

...

<form action="/products/<%= product._id %>?_method=PUT" method="POST">
```
- PUT 요청을 보내고 라우트에서 확인
```javascript
// ... index.js

...

// 개별 상품 업데이트하기
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true, // default 유효성 검사
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});
```

### option selected 설정하기
```html
<!-- edit.ejs -->

...

<option value="fruit" <%= product.category === "fruit" ? "selected" : "" %> >fruit</option>
<option value="fruit" <%= product.category === "vegetable" ? "selected" : "" %> >vegetable</option>
<option value="fruit" <%= product.category === "diary" ? "selected" : "" %> >diary</option>
```
- 위의 예시처럼 조건을 설정해 `option`에 `selected` 값을 추가해도 되지만 카테고리가 추가될 수록 가독성이 떨어짐
- 옵션을 생성하는 loop 설정하기

```javascript
// ... index.js 

...

const categories = ["fruit", "vegetable", "dairy"];

...

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});
```
- loop를 활용한 조건
```html
<!-- edit.ejs -->

...

<% for(let category of categories) {%>
<option value="<%= category %>" <%= product.category === category ? "selected" : "" %> > <%= category %> </option>
<% } %>

```


## `DELETE` 상품 정보 삭제하기
```html
<!-- show.ejs -->

...

<form action="/products/<%= products._id %>?_method=DELETE" method="POST">
  <button>DELETE</button>
</form>
```

```javascript
// ... index.js

...

// 상품 정보 삭제
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

```

### 카테고리별로 필터링하기






