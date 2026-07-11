const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ProductList = require("./ProductListModel")

const Order = new Schema({
    sum: {
        type: Number,
        required: true
    },
    productList: {
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        id: {
            type: String,
            required: true
        }
    }
})

module.exports = mongoose.model("Order", Order)