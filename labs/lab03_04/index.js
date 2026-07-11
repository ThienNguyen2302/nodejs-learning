require("dotenv").config();
const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const emailValidator = require("email-validator");
const multer = require("multer");
const fs = require("fs");
const uuid = require("short-uuid");
const session = require("express-session");
const app = express();

const products = new Map();

const upload = multer({
  dest: "uploads",
  fileFilter: (req, file, callback) => {
    // only save image
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else callback(null, false);
  },
  limits: { fileSize: 5000000 },
});

app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(session({ secret: "secret_password_here" }));

function authChecker(req, res, next) {
  if (req.session.user || req.path === "/login") {
    next();
  } else {
    res.redirect("login");
  }
}

app.use(authChecker);

app.get("/", (req, res) => {
  res.render("index", { products: products.values() });
});

app.get("/add", (req, res) => {
  res.render("add", { name: "", price: "", desc: "" });
});

app.post("/add", (req, res) => {
  // res.render("add");
  let uploader = upload.single("image");

  uploader(req, res, (err) => {
    let { name, price, desc } = req.body;
    let image = req.file;
    let error = undefined;
    if (!name || name.length === 0) {
      error = "Vui lòng nhập tên sản phẩm";
    } else if (!price || price.length === 0) {
      error = "Vui lòng nhập giá sản phẩm";
    } else if (isNaN(price) || parseInt(price) < 0) {
      error = "Giá sản phẩm không hợp lệ ";
    } else if (!desc || desc.length === 0) {
      error = "Vui lòng nhập thêm mô tả";
    } else if (err) {
      error = "File ảnh quá lớn";
    } else if (!image) {
      error = "Ảnh không hợp lệ";
    }

    if (error) {
      res.render("add", { error, name, price, desc });
    } else {
      fs.renameSync(image.path, `uploads/${image.originalname}`);
      let product = {
        id: uuid.generate(),
        name: name,
        price: parseInt(price),
        desc: desc,
        image: `uploads/${image.originalname}`,
      };
      products.set(product.id, product);
      res.redirect("/");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const acc = req.body;
  if (!acc.email) {
    res.render("login", {
      error: "Vui lòng nhập Email",
      email: acc.email,
      password: acc.pass,
    });
  } else if (!emailValidator.validate(acc.email)) {
    res.render("login", {
      error: "Vui lòng nhập email",
      email: acc.email,
      password: acc.pass,
    });
  } else if (!acc.pass) {
    res.render("login", {
      error: "Vui lòng nhập password",
      email: acc.email,
      password: acc.pass,
    });
  } else if (acc.pass.length < 6) {
    res.render("login", {
      error: "Mật khẩu phải có ít nhất 6 kí tự",
      email: acc.email,
      password: acc.pass,
    });
  } else if (
    acc.email != process.env.admin ||
    acc.pass != process.env.password
  ) {
    res.render("login", {
      error: "Tài khoản đăng nhập không hợp lệ",
      email: acc.email,
      password: acc.pass,
    });
  } else {
    req.session.user = acc.email;
    res.redirect("/");
  }
});

app.get("/product/:id", (req, res) => {
  let id = req.params.id;
  let product = products.get(id);
  res.render("product", { product });
});

// delete api
app.post("/delete", (req, res) => {
  let { id } = req.body;
  if (!id) {
    res.json({ code: 1, message: "Mã sản phẩm không hợp lệ" });
  } else if (!products.has(id)) {
    res.json({ code: 2, message: "Sản phẩm không tồn tại" });
  } else {
    let p = products.get(id);
    products.delete(id);
    res.json({ code: 0, message: "Xóa thành công", data: p });
  }
});

app.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  if (!id) {
    res.redirect("/");
  } else {
    let product = products.get(id);
    res.render("update", product);
  }
});

// update api
app.post("/edit/:id", (req, res) => {
  let id = req.params.id;
  let uploader = upload.single("image");
  uploader(req, res, (err) => {
    let product = products.get(id);
    let image = req.file;
    let error = undefined;
    if (!product.name || product.name.length === 0) {
      error = "Vui lòng nhập tên sản phẩm";
    } else if (!product.price || product.price.length === 0) {
      error = "Vui lòng nhập giá sản phẩm";
    } else if (isNaN(product.price) || parseInt(product.price) < 0) {
      error = "Giá sản phẩm không hợp lệ ";
    } else if (!product.desc || product.desc.length === 0) {
      error = "Vui lòng nhập thêm mô tả";
    } else if (err) {
      error = "File ảnh quá lớn";
    }

    if (error) {
      res.render("update", { error, product });
    } else {
      if (req.body.name) product.name = req.body.name;

      if (req.body.price) product.price = parseInt(req.body.price);

      if (req.body.desc) product.desc = req.body.desc;

      if (image) {
        fs.renameSync(image.path, `uploads/${image.originalname}`);
        product.image = `uploads/${image.originalname}`;
      }
      product.id = id;
      products.set(id, product);
      res.redirect("/");
    }
  });
});

app.use((req, res) => {
  res.set("Content-Type", "text/html");
  res.send("Liên kết không hổ trợ");
});

app.listen(8080, () => {
  console.log("http://localhost:8080/");
});
