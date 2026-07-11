const express = require("express");
const Mongo = require("./config/database");
const handlebars = require("express-handlebars");
const catchAsync = require("./middlewares/Async");
const CatchError = require("./middlewares/CatchError");
const User = require("./model/userSchema");
const session = require("express-session");
const { redirect } = require("express/lib/response");
Mongo.connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(session({ secret: "secret_password_here" }));
app.engine(
  "hbs",
  handlebars.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

function authChecker(req, res, next) {
  if (req.session.user || req.path === "/login") {
    next();
  } else {
    res.redirect("login");
  }
}

app.use(function (req, res, next) {
  // if there's a flash message, transfer
  // it to the context, then clear it
  res.locals.editFlash = req.session.editFlash;
  res.locals.addFlash = req.session.addFlash;
  res.locals.deleteFlash = req.session.deleteFlash;
  delete req.session.editFlash;
  delete req.session.addFlash;
  delete req.session.deleteFlash;
  next();
});

app.use(authChecker);

User.find(function (err, users) {
  if (users.length) return;
  new User({
    name: "Nguyễn Ngọc Thiện",
    email: "admin@gmail.com",
    pass: "123456",
  }).save();
});

app.get("/", async (req, res) => {
  User.find({ available: true }, function (err, users) {
    var context = {
      users: users.map(function (user) {
        return {
          email: user.email,
          name: user.name,
        };
      }),
    };
    res.render("index", context);
  });
});

app.get("/login", (req, res) => {
  if (!req.session.user) {
    res.render("login");
  } else {
    res.redirect("/");
  }
});

// app.post(
//   "/login",
//   catchAsync(async (req, res) => {
//     const { email, pass } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.json({
//         code: 404,
//         message: "Invalid account",
//       });
//     if (pass !== user.pass)
//       return res.json({
//         code: 404,
//         message: "Invalid account",
//       });
//     res.json({
//       code: 200,
//       success: true,
//     });
//   })
// );

app.get("/add", (req, res) => {
  res.render("add", { name: "", email: "", pass: "" });
});

app.post("/add", (req, res) => {
  let { email, pass, name } = req.body;
  let error = undefined;
  
  if (!name || name.length === 0) {
    error = "Vui lòng nhập tên người dùng";
  } else if (!email || email.length === 0) {
    error = "Vui lòng nhập email";
  } else if (!pass || pass.length === 0) {
    error = "Vui lòng nhập thêm mật khẩu";
  }

  if (error) {
    res.render("add", { error, name, email, pass });
  } else {
    const user = User.create({
      name,
      pass,
      email,
    });
    req.session.addFlash = "Đã thêm người dùng thành công";
    res.redirect("/");
  }
});

app.post(
  "/login",
  catchAsync(async (req, res) => {
    const { email, pass } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Invalid Account",
        email: email,
        password: pass,
      });
    }
    if (pass !== user.pass) {
      return res.render("login", {
        error: "Invalid Account",
        email: email,
        password: pass,
      });
    }
    req.session.user = email;
    res.redirect("/");
  })
);

// app.post(
//   "/register",
//   catchAsync(async (req, res) => {
//     const { name, pass, email } = req.body;
//     const user = await User.create({
//       name,
//       pass,
//       email,
//     });
//     res.status(200).json({
//       success: true,
//       user,
//     });
//   })
// );

app.get(
  "/user/:email",
  catchAsync(async (req, res) => {
    let email = req.params.email;
    let find = await User.findOne({ email });
    let user = {
      email: find.email,
      pass: find.pass,
      name: find.name,
    };
    res.render("user", { user });
  })
);

app.get(
  "/edit/:email",
  catchAsync(async (req, res) => {
    let email = req.params.email;
    let user = await User.findOne({ email });
    res.render("edit", {
      email: user.email,
      pass: user.pass,
      name: user.name,
    });
  })
);

app.post(
  "/edit/:email",
  catchAsync(async (req, res) => {
    let { name, pass } = req.body;
    let email = req.params.email;
    let error = undefined;
    if (!name || name.length === 0) {
      error = "Vui lòng nhập tên người dùng";
    } else if (!email || email.length === 0) {
      error = "Vui lòng nhập email";
    } else if (!pass || pass.length === 0) {
      error = "Vui lòng nhập thêm mật khẩu";
    }
    if (error) {
      res.render("edit", { error, name, email, pass });
    } else {
      await User.updateOne({ email }, { name, pass });
      req.session.editFlash = "Đã cập nhật cho " + name;
      res.redirect("/");
    }
  })
);

app.post(
  "/delete",
  catchAsync(async (req, res) => {
    let { email } = req.body;
    if (!email) {
      return res.json({ code: 1, message: "Mã người dùng không hợp lệ" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ code: 1, message: "Mã người dùng không hợp lệ" });
    } else {
      await User.deleteOne({ email });
      req.session.deleteFlash = "Đã xóatài khoản" + email + "thành công";
      return res.json({ code: 0, message: "Đã xóa người dùng thành công" });
    }
  })
);

app.use(CatchError);

app.listen(8080, () => {
  console.log(8080);
});
