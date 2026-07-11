const { check } = require("express-validator")
module.exports = {
    add: [
        check('name').exists().withMessage("Tên sản phẩm không được để trống")
            .notEmpty().withMessage('Vui lòng nhập tên sản phẩm.'),

        check('description').exists().withMessage("Mô tả sản phẩm không được để trống")
            .notEmpty().withMessage('Vui lòng nhập thông tin sản phẩm'),

        check('price').exists().withMessage("Giá sản phẩm không được để trống")
            .notEmpty().withMessage('Vui lòng nhập giá sản phẩm')
            .isNumeric().withMessage("Giá sản phầm phải là số"),

    ],

}