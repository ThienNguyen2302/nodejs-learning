const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductList = new Schema({
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
})

module.exports = mongoose.model("ProductList", ProductList)