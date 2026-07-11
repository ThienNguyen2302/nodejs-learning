const express = require("express")
const router = express.Router()
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const Account = require("../models/AccountModel")
const validator = require("../Validator/AccountValidator")
const jwt = require("jsonwebtoken")


router.post("/register", validator.registerValidator, (req, res) => {
    let validator = validationResult(req)
    if (validator.errors.length === 0) {
        let { email, password } = req.body

        // check if email existed
        Account.findOne({ email })
            .then(exists => {
                if (exists) {
                    return res.json({ code: 3, message: "Email đã tồn tại!!!" })
                }
            })
            .catch(e => {
                return res.status(401).json({ code: 4, message: "Kết nối database thất bại" })
            })

        bcrypt.hash(password, 10)
            .then(hashed => {
                let user = new Account({
                    email,
                    password: hashed
                })
                return user.save().then(() => {
                    res.json({ code: 0, message: "Đăng ký tài khoản thành công", data: user })
                })
            })
            .catch(e => {
                res.json({ code: 2, message: "Đăng ký tài khoản thất bại: " + e.message })
            })

    }
    else {
        res.json({ code: 1, message: validator.errors[0].msg })
    }
})

router.post("/login", validator.loginValidator, async (req, res) => {
    let validator = validationResult(req)
    if (validator.errors.length === 0) {
        let { email, password } = req.body

        // check if email existed
        Account.findOne({ email: email })
            .then(acc => {
                if (!acc) {
                    res.json({ code: 3, message: "Email chưa được đăng ký!!!" })
                }
                else if (bcrypt.compare(password, acc.password)) {
                    jwt.sign({
                        email: acc.email,
                    }, process.env.JWT_SECRET, {
                        expiresIn: "1h"
                    }, (err, token) => {
                        if (err) throw err
                        res.status(200).json({ code: 0, message: "Đăng nhập thành công", token: token })
                    })
                }
                else {
                    res.status(401).json({ code: 2, message: "Sai tên đăng nhập hoặc mật khẩu" })
                }
            })
            .catch(e => {
                return res.status(401).json({ code: 4, message: "Kết nối database thất bại: " + e.message })
            })
    }
    else {
        res.json({ code: 1, message: validator.errors[0].msg })
    }
})
module.exports = router