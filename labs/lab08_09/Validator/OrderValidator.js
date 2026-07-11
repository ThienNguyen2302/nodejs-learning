const { check } = require("express-validator")
module.exports = {
    add: [
        check('id').exists().withMessage("ID sản phẩm không được để trống")
            .notEmpty().withMessage('Vui lòng nhập ID sản phẩm'),

        check('quantity').exists().withMessage("Số lượng sản phẩm không được để trống")
            .notEmpty().withMessage('Vui lòng nhập số lượng sản phẩm')
            .isNumeric().withMessage("Số lượng sản phầm phải là số"),

        check('price').exists().withMessage("Giá sản phẩm không được để trống")
            .notEmpty().withMessage('Vui lòng nhập giá sản phẩm')
            .isNumeric().withMessage("Giá sản phầm phải là số"),

    ]
}