const express = require("express")
const router = express.Router()
const AuthLogin = require("../middlewares/AuthLogin")
const Product = require("../models/ProductModel")
const Order = require("../models/OrderModel")
const { validationResult } = require("express-validator")
const validator = require("../Validator/OrderValidator")

router.get("/", AuthLogin, (req, res) => {
    Order.find()
        .then(orders => {
            res.json({ code: 0, message: "Đọc danh sách thành công", data: orders })
        })
        .catch(e => { res.json({ code: 2, message: e.message }) })
})

router.post("/", AuthLogin, validator.add, async (req, res) => {
    const { quantity, price, id } = req.body
    let result = validationResult(req)
    if (result.errors.length !== 0) {
        return res.json({ code: 1, message: result.errors[0].msg })
    }
    Product.findById(id)
        .then(p => {
            if (!p) {
                return res.json({ code: 1, message: "Mã Sản phẩm không tồn tại" })
            }
        })
        .catch(e => {
            if (e.message.includes("Cast to ObjectId failed")) {
                return res.json({ code: 2, message: "ID không hợp lệ" })
            }
            return res.json({ code: 2, message: e.message })
        })

    let sum = quantity * price
    let order = new Order({
        sum,
        productList: {
            quantity,
            price,
            id
        }
    })
    order.save().then(() => {
        res.json({ code: 0, message: "Thêm đơn hàng thành công", data: order })
    })
        .catch(e => {
            res.json({ code: 2, message: e.message })
        })
})

router.get("/:id", AuthLogin, (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.json({ code: 1, message: "Vui lòng thêm mã đơn hàng" })
    }
    Order.findById(id)
        .then(order => {
            if (order) {
                return res.json({ code: 0, message: "Đã tìm thấy đơn hàng", data: order })
            }
            return res.json({ code: 1, message: "Không tìm tháy đơn hàng" })
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
        return res.json({ code: 1, message: "Vui lòng thêm mã đơn hàng" })
    }
    Order.findByIdAndDelete(id)
        .then(order => {
            if (order) {
                return res.json({ code: 0, message: "Đã xóa đơn hàng", data: order })
            }
            return res.json({ code: 1, message: "Không tìm tháy đơn hàng" })
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
        return res.json({ code: 1, message: "Vui lòng thêm mã đơn hàng" })
    }

    let supported = ["quantity", "price", "id"]
    let updateData = req.body
    for (filed in updateData) {
        if (!supported.includes(filed))
            delete updateData[filed]
    }
    let newData = {
        sum: updateData.price * updateData.quantity,
        productList: updateData
    }
    Order.findByIdAndUpdate(id, newData, { new: true })
        .then(order => {
            if (order) {
                return res.json({ code: 0, message: "Đã cập nhật đơn hàng", data: order })
            }
            return res.json({ code: 1, message: "Không tìm tháy đơn hàng" })
        })
        .catch(e => {
            if (e.message.includes("Cast to ObjectId failed")) {
                return res.json({ code: 2, message: "ID không hợp lệ" })
            }
            res.json({ code: 2, message: e.message })
        })
})

module.exports = router