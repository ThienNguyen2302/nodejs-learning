const express = require("express")
const router = express.Router()
const fs = require("fs")
const multer = require("multer")
const uploader = multer({ dest: __dirname.replace("routers", "") + "/uploads/" })

router.post("/upload", uploader.single('attachment'), (req, res) => {
  const file = req.file
  const dir = req.body.dir
  if (!file) {
    return res.json({ code: 1, message: "Thông tin không hợp lệ" })
  }
  if (!fs.existsSync(dir)) {
    return res.json({ code: 2, message: "Đường dẫn không tồn tại" })
  }
  let name = file.originalname
  let newPath = dir + "/" + name
  fs.renameSync(file.path, newPath)
  return res.json({ code: 0, message: "Lưu file thành công tại" + newPath })
})

router.post("/delete", (req, res) => {
  const { fileName, dir, ext } = req.body
  if (!fileName || !dir) {
    return res.json({ code: 1, message: "Thông tin không hợp lệ" })
  }
  if (!fs.existsSync(dir)) {
    return res.json({ code: 2, message: "Đường dẫn không tồn tại" })
  }
  if (!ext) {
    fs.unlink(dir + "/" + fileName, (err) => {
      if (err) {
        return res.json({ code: 3, message: "Có lỗi xảy ra vui lòng thử lại" });
      }
      req.session.flash = {
        message: "Bạn đã xóa file " + fileName + " thành công",
        type: "success",
      }
      return res.json({ code: 0, message: "Đã xóa file" + fileName })
    });
  }
  else {
    fs.rm(dir + "/" + fileName, { recursive: true }, (err) => {
      if (err) {
        return res.json({ code: 3, message: "Có lỗi xảy ra vui lòng thử lại" });
      }

      req.session.flash = {
        message: "Bạn đã xóa folder " + fileName + " thành công",
        type: "success",
      }
      return res.json({ code: 0, message: "Đã xóa folder" + fileName })
    });
  }

})

router.post("/rename", (req, res) => {
  const { fileName, dir, newName } = req.body
  if (!fileName || !dir || !newName) {
    return res.json({ code: 1, message: "Thông tin không hợp lệ" })
  }
  if (!fs.existsSync(dir)) {
    return res.json({ code: 2, message: "Đường dẫn không tồn tại" })
  }
  fs.renameSync(dir + "/" + fileName, dir + "/" + newName)
  req.session.flash = {
    message: "Bạn đã đổi tên file " + fileName + " thành tên " + newName,
    type: "success",
  }
  return res.json({ code: 0, message: "Đổi tên file thành công" })

})

router.post("/create", (req, res) => {
  const { name, dir, content } = req.body
  if (!name || !dir || !content) {
    return res.json({ code: 1, message: "Thông tin không hợp lệ" })
  }
  if (!fs.existsSync(dir)) {
    return res.json({ code: 2, message: "Đường dẫn không tồn tại" })
  }
  fs.writeFileSync(dir + "/" + name + ".txt", content)
  req.session.flash = {
    message: "Bạn đã tạo thành công file " + name,
    type: "success",
  }
  return res.json({ code: 0, message: "tạo file thành công" })

})

router.post("/new", (req, res) => {
  const { name, dir } = req.body
  if (!name || !dir) {
    return res.json({ code: 1, message: "Thông tin không hợp lệ" })
  }
  if (!fs.existsSync(dir)) {
    return res.json({ code: 2, message: "Đường dẫn không tồn tại" })
  }
  fs.mkdir(dir + "/" + name, (err) => {
    if (err) {
      return res.json({ code: 3, message: "Có lỗi xảy ra" })
    }
    req.session.flash = {
      message: "Bạn đã tạo thành công folder " + name,
      type: "success",
    }
    return res.json({ code: 0, message: "tạo folder thành công" })
  });
})

module.exports = router