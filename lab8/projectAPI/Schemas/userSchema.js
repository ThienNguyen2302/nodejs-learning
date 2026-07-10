const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const Student = new Schema(
    {
        name: {
            type: String,
            require: [true, "name is required"],
        },
        email: {
            type: String,
            require: [true, "email is required"],
            unique: [true, "email is duplicated"]
        },
        gender: {
            type: String,
            require: [true, "gender is required"]
        },
        age: {
            type: Number,
            require: [true, "age is required"],
        },
        address: {
            type: String,
            require: [true, "address is required"],
        },
        class: {
            type: String,
            require: [true, "class is required"],
        }
    }
)

module.exports = mongoose.model("Student", Student)