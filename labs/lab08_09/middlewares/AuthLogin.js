const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    let authorization = req.header("Authorization")
    if (!authorization) {
        return res.status(401).json({ code: 101, message: "Vui lòng cung cấp jwt token" })
    }

    let token = authorization.split(" ")[1]
    if (!token) {
        return res.status(401).json({ code: 101, message: "Vui lòng cung cấp jwt token tại header" })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({ code: 101, message: "Token không hợp lệ vui lòng đăng nhập lại" })
        }

        req.user = data
        next()
    })
}