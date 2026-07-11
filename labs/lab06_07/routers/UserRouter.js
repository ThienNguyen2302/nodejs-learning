const express = require("express")
const { check, validationResult } = require("express-validator")
const database = require("../config/database")
const bcrypt = require("bcrypt")
const router = express.Router()
const fs = require("fs")

const loginValidator = [
  check('email').exists().withMessage('Vui lòng nhập email người dùng.')
    .notEmpty().withMessage('Email người dùng không được bỏ trống')
    .isEmail().withMessage('Vui lòng nhập đúng email.'),

  check('password').exists().withMessage('Vui lòng nhập password')
    .notEmpty().withMessage('Password người dùng không được bỏ trống')
    .isLength({ min: 6 }).withMessage("Password phải có ít nhất 6 kí tự")
]

router.get("/login", (req, res) => {
  res.render("login")
})

router.post("/login", loginValidator, (req, res) => {
  const validation = validationResult(req)
  //validation=validation.mapped()
  let { email, password } = req.body
  if (validation.errors.length > 0) {
    req.session.flash = {
      message: validation.errors[0].msg,
      type: "danger",
    }
    req.session.account = {
      email
    }
    return res.redirect("/login")
  }
  let sql = "SELECT * FROM account WHERE email = ?"
  let params = [email]
  database.query(sql, params, (err, results, fields) => {
    if (err) {
      req.session.flash = {
        message: "Có lỗi trong quá trình xử lý vui lòng thử lại",
        type: "danger",
      }
      return res.redirect("/login")
    }
    else if (results === 0) {
      req.session.flash = {
        message: "Tài khoản không tồn tại",
        type: "danger",
      }
      return res.redirect("/login")
    }
    else {
      let hash = results[0].password
      if (bcrypt.compareSync(password, hash)) {
        //login success
        user = results[0]
        user.root = `${req.vars.root}/users/${user.email}`
        req.session.user = user
        req.app.use(express.static(user.root))
        res.redirect("/")
      }
      else {
        req.session.flash = {
          message: "Sai email hoặc mật khẩu",
          type: "danger",
        }
        req.session.account = {
          email
        }
        return res.redirect("/login")
      }
    }
  })
})

router.get("/register", (req, res) => {
  res.render("register")
})

const registerValidator = [
  check('name').exists().withMessage("Vui lòng nhập tên người dùng.")
    .notEmpty().withMessage('Tên người dùng không được bỏ trống'),

  check('email').exists().withMessage('Vui lòng nhập email người dùng.')
    .notEmpty().withMessage('Email người dùng không được bỏ trống')
    .isEmail().withMessage('Vui lòng nhập đúng email.'),

  check('password').exists().withMessage('Vui lòng nhập password')
    .notEmpty().withMessage('Password người dùng không được bỏ trống')
    .isLength({ min: 6 }).withMessage("Password phải có ít nhất 6 kí tự"),

  check('rePassword').exists().withMessage('Vui lòng nhập xác nhận password')
    .notEmpty().withMessage('Vui lòng nhập xác nhận password')
    .custom(async (value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Mật khẩu không khớp")
      }
      return true;
    })
]

router.post("/register", registerValidator, (req, res) => {
  const validation = validationResult(req)
  //validation=validation.mapped()
  const { name, email, password } = req.body
  if (validation.errors.length > 0) {
    req.session.flash = {
      message: validation.errors[0].msg,
      type: "danger",
    }
    req.session.account = {
      name,
      email
    }
    return res.redirect("/register")
  }
  const hash = bcrypt.hashSync(password, 10)
  let params = [
    name,
    email,
    hash
  ]
  let sql = "INSERT INTO account(name, email, password) Values (?,?,?)"
  database.query(sql, params, (err, results, fields) => {
    if (err) {
      req.session.flash = {
        message: "Tài khoản đã tồn tại",
        type: "danger",
      }
      return res.redirect("/register")
    }
    else if (results.affectedRows === 1) {
      req.session.flash = {
        message: "Bạn đã đăng ký thành công",
        type: "success",
      }
      const { root } = req.vars
      dir = `${root}/users/${email}`
      fs.mkdir(dir, () => {

        return res.redirect("/login")
      })
    }
    else {
      req.session.flash = {
        message: results.message,
        type: "danger",
      }
      req.session.account = {
        name,
        email
      }
      return res.redirect("/register")
    }
  })

})


module.exports = router