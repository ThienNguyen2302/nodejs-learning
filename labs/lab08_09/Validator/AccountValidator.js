const { check } = require("express-validator")
module.exports = {
    registerValidator: [
        check('email').exists().withMessage('Vui lòng nhập email người dùng.')
            .notEmpty().withMessage('Email người dùng không được bỏ trống')
            .isEmail().withMessage('Vui lòng nhập đúng email.'),

        check('password').exists().withMessage('Vui lòng nhập password')
            .notEmpty().withMessage('Password người dùng không được bỏ trống')
            .isLength({ min: 6 }).withMessage("Password phải có ít nhất 6 kí tự"),

        check('rePassword').exists().withMessage('Vui lòng nhập xác nhận password')
            .notEmpty().withMessage('Vui lòng nhập xác nhận password')
            .custom(async (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Xác nhận mật khẩu phải trùng với mật khẩu")
                }
                return true;
            })
    ],

    loginValidator: [
        check('email').exists().withMessage('Vui lòng nhập email người dùng.')
            .notEmpty().withMessage('Email người dùng không được bỏ trống')
            .isEmail().withMessage('Vui lòng nhập đúng email.'),

        check('password').exists().withMessage('Vui lòng nhập password')
            .notEmpty().withMessage('Password người dùng không được bỏ trống')
            .isLength({ min: 6 }).withMessage("Password phải có ít nhất 6 kí tự")
    ]
}