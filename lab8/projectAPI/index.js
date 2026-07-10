const express = require("express");
const Mongo = require("./config/database");
const {check, validationResult} = require("express-validator")
const catchAsync = require("./middlewares/Async");
const CatchError = require("./middlewares/CatchError");
const Student = require("./Schemas/userSchema");

Mongo.connect();

const app = express();

const validator = [check('name').notEmpty().withMessage('Vui lòng nhập tên học sinh.'), 
                  check('email').notEmpty().withMessage('Vui lòng nhập email học sinh.')
                  .isEmail().withMessage('Vui lòng nhập đúng email.'),
                  check("class").notEmpty().withMessage('Vui lòng nhập lớp học sinh.'),
                  check("address").notEmpty().withMessage('Vui lòng nhập địa chỉ học sinh.'),
                  check('gender').notEmpty().withMessage('Vui lòng chọn giới tính.'),
                  check('age').notEmpty().withMessage('Vui lòng nhập tuổi học sinh.')
                  .isNumeric().withMessage("Tuổi của học sinh phải là số"),]

Student.find(function (err, students) {
  if (students.length) return;
    new Student({
      name: "Nguyễn Ngọc Thiện",
      email: "nguyenngocthien@gmail.com",
      gender: "male",
      class: "19050201",
      address: "161/29 Ho Chi Minh City",
      age: 21
    }).save();
});

app.use(express.json());
app.use(express.urlencoded());
app.use(require("cors")())

app.get("/", async (req, res) => {
  Student.find({},function(err, students) {
    if (err)
      return res.json({code: 404, message: "Sinh Viên Không Tồn Tại !!"})
    res.json({ code: 200, data:  students});
  })
});

app.get("/:id", async (req, res) => {
  try {
    let student = await Student.findById(req.params.id)
    res.json({ code: 200, data:  student});
  }catch {
    return res.json({code: 404, message: "Sinh Viên Không Tồn Tại !!"})
  }
});

app.post("/add", validator,async (req,res) => {
  const result = validationResult(req)
  if(result.errors.length > 0) {
    // có lỗi input
    res.json({code: 404, message: result.errors[0].msg})
  }
  else {
    let value = req.body;
    try {
      let exist = await Student.findOne({email: value.email})
      if(exist){
        return res.json({code: 500, message: "Vui lòng nhập email khác"})
      }
      const student = await Student.create(value)
      res.json({code: 200, message:"Đã thêm sinh viên", data: student})
    }
    catch {
      res.json({code:500, message: "Sever Error"})
    }
  }

})

app.put("/edit/:id",validator, async (req,res) => {
  if(!req.params.id) {
    return res.json({code: 404, message: "Đường dẫn không hợp lệ"})
  }
  const result = validationResult(req)
  if(result.errors.length > 0) {
    // có lỗi input
    res.json({code: 404, message: result.errors[0].msg})
  }
  else{
    try {
      let student = await Student.findById(req.params.id)
      if(!student){
        return res.json({code: 500, message: "Sinh viên không tồn tại"})
      }
      Object.assign(student, req.body)
      student.save()
      res.json({code: 200, message:"Đã cập nhật sinh viên", data: student})
    }catch {
      return res.json({code: 500, message: "Sever error"})
    }
  }
})

app.delete("/delete/:id",async (req,res) => {
  try {
    let student = await Student.findById(req.params.id)
    await student.remove()
    res.json({code: 200, message:"xóa sinh viên", data: student})
  }catch {
    return res.json({code: 404, message: "Sinh Viên Không Tồn Tại !!"})
  }
})

// app.post(
//   "/login",
//   catchAsync(async (req, res) => {
//     const { email, pass } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.json({
//         code: 404,
//         message: "Invalid account",
//       });
//     if (pass !== user.pass)
//       return res.json({
//         code: 404,
//         message: "Invalid account",
//       });
//     res.json({
//       code: 200,
//       success: true,
//     });
//   })
// );

// app.post(
//   "/register",
//   catchAsync(async (req, res) => {
//     const { name, pass, email } = req.body;
//     const user = await User.create({
//       name,
//       pass,
//       email,
//     });
//     res.status(200).json({
//       success: true,
//       user,
//     });
//   })
// );

app.use(CatchError);

app.listen(8080, () => {
  console.log(8080);
});
