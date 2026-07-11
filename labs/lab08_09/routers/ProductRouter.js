const express = require("express")
const router = express.Router()
const { validationResult } = require("express-validator")
const validator = require("../Validator/ProductValidator")
const Product = require("../models/ProductModel")
const AuthLogin = require("../middlewares/AuthLogin")
const fs = require('fs');
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    Product.find()
        .then(products => {
            res.json({ code: 0, message: "Đọc danh sách thành công", data: products })
        })
        .catch(e => { res.json({ code: 2, message: e.message }) })
})

router.post("/", AuthLogin, upload.single('image'), validator.add, (req, res) => {
    let validator = validationResult(req)
    if (validator.errors.length === 0) {
        const { name, price, description } = req.body
        let product = new Product({
            name: name,
            price: price,
            description: description,
            img: {
                data: fs.readFileSync(path.join(__dirname.replace("routers", "") + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        })
        product.save().then(() => {
            res.json({ code: 0, message: "Thêm sản phẩm thành công", data: product })
        })
            .catch(e => {
                res.json({ code: 2, message: e.message })
            })
    }
    else {
        res.json({ code: 1, message: validator.errors[0].msg })
    }
})

router.get("/:id", (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.json({ code: 1, message: "Vui lòng thêm mã sản phẩm" })
    }
    Product.findById(id)
        .then(product => {
            if (product) {
                return res.json({ code: 0, message: "Đã tìm thấy sản phẩm", data: product })
            }
            return res.json({ code: 1, message: "Không tìm tháy sản phẩm" })
        })
        .catch(e => {
            if (e.message.includes("Cast to ObjectId failed")) {
                return res.json({ code: 2, message: "ID không hợp lệ" })
            }
            res.json({ code: 2, message: e.message })
        })
})

router.delete("/:id", AuthLogin, (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.json({ code: 1, message: "Vui lòng thêm mã sản phẩm" })
    }
    Product.findByIdAndDelete(id)
        .then(product => {
            if (product) {
                return res.json({ code: 0, message: "Đã xóa sản phẩm", data: product })
            }
            return res.json({ code: 1, message: "Không tìm tháy sản phẩm" })
        })
        .catch(e => {
            if (e.message.includes("Cast to ObjectId failed")) {
                return res.json({ code: 2, message: "ID không hợp lệ" })
            }
            res.json({ code: 2, message: e.message })
        })
})

router.put("/:id", AuthLogin, (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.json({ code: 1, message: "Vui lòng thêm mã sản phẩm" })
    }

    let supported = ["name", "description", "price"]
    let updateData = req.body
    console.log(req.body)
    for (filed in updateData) {
        if (!supported.includes(filed))
            delete updateData[filed]
    }
    Product.findByIdAndUpdate(id, updateData, { new: true })
        .then(product => {
            if (product) {
                return res.json({ code: 0, message: "Đã cập nhật sản phẩm", data: product })
            }
            return res.json({ code: 1, message: "Không tìm tháy sản phẩm" })
        })
        .catch(e => {
            if (e.message.includes("Cast to ObjectId failed")) {
                return res.json({ code: 2, message: "ID không hợp lệ" })
            }
            res.json({ code: 2, message: e.message })
        })
})

module.exports = router