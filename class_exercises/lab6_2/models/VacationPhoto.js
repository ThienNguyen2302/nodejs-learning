const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const VacationPhoto = new Schema(
    {
        name: {
            type: String,
            require: [true, "name is required"],
            unique: [true, "email is duplicated"]
        },
        desc: {
            type: String,
            require: [true, "description is required"]
        },
        price: {
            type: Number,
            min: [0,"Price must be more than 0 dollars characters"],
        },
        imgpath: {
            type: String,
            require: [true, "image path is required"]
        }
    }
)

module.exports = mongoose.model("VacationPhoto", VacationPhoto)