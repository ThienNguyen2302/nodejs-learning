const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Product = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        data: Buffer,
        contentType: String
    },
    description: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Product", Product)