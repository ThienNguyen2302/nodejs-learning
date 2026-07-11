const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const User = new Schema(
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
        pass: {
            type: String,
            min: [6,"pass must be more than 6 characters"],
            max: [20,"pass must be less than 20 characters"],
        }

    }
)

module.exports = mongoose.model("User", User)