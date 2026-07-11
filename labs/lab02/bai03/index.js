const http = require("http");
const URL = require("url");
const queryParser = require("querystring");

const pattern = /\/students\/[a-zA-Z0-9]+\/*$/ig
const students = new Map();

const sever = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    const url = URL.parse(req.url);
    if (url.pathname === "/students/") {
        if (req.method === "POST") {
            return addStudent(req, res);
        }
        else if (req.method === "GET") {
            return loadStudents(req, res);
        }
        else return res.end(JSON.stringify({ code: 101, message: "Sever không hỗ trợ phương thức này" }))
    }
    else if (url.pathname.match(pattern)) {
        const IDpattern = /[a-zA-Z0-9]+\/*$/ig
        let id = url.pathname.match(IDpattern)[0].replace(/\/*$/ig, "")
        if (req.method === "PUT") {
            return findByIDAndUpdate(req, res, id);
        }
        else if (req.method === "GET") {
            return findByID(req, res, id)
        }
        else if (req.method === "DELETE") {
            return findByIDAndDelete(req, res, id);
        }
        else return res.end(JSON.stringify({ code: 101, message: "Sever không hỗ trợ phương thức này" }))
    }
    else return res.end(JSON.stringify({ code: 101, message: "Sever không hỗ trợ đường dẫn này" }))
    //  res.end(JSON.stringify({code: 100, message: "Sever is running"}))



}).listen(8080, () => {
    console.log("Sever is running at http://localhost:8080")
})

function addStudent(req, res) {
    let body = "";
    req.on("data", d => body += d.toString())
    req.on("end", () => {
        body = queryParser.decode(body)
        if (!body.id) {
            return res.end(JSON.stringify({ code: 1, message: "Chưa có mã sinh viên" }))
        }
        if (!body.name) {
            return res.end(JSON.stringify({ code: 1, message: "Chưa có tên sinh viên" }))
        }
        if (!body.age) {
            return res.end(JSON.stringify({ code: 1, message: "Chưa có tuổi sinh viên" }))
        }
        if (isNaN(body.age)) {
            return res.end(JSON.stringify({ code: 1, message: "Tuổi sinh viên chưa hợp lệ" }))
        }
        if (body.age < 15 || body.age > 100) {
            return res.end(JSON.stringify({ code: 1, message: "Tuổi không hợp lệ" }))
        }
        if (students.has(body.id)) {
            return res.end(JSON.stringify({ code: 2, message: `Mã số ${body.id} đã tồn tại` }))
        }
        students.set(body.id, body)
        return res.end(JSON.stringify({ code: 0, message: "thêm sinh viên thành công" }))
    })
}

function loadStudents(req, res) {
    if (students.size === 0) {
        return res.end(JSON.stringify({ code: 102, message: "Chưa có sinh viên nào" }))
    }
    let studentList = Array.from(students)
    return res.end(JSON.stringify({ code: 0, message: "Đọc sinh viên thành công", data: studentList }))
}

function findByID(req, res, id) {
    if (!students.has(id)) {
        return res.end(JSON.stringify({ code: 103, message: "ID không tồn tại" }))
    }

    const student = students.get(id)
    return res.end(JSON.stringify({ code: 0, message: "Đã tìm thấy sinh viên", data: student }))
}

function findByIDAndUpdate(req, res, id) {
    if (!students.has(id)) {
        return res.end(JSON.stringify({ code: 103, message: "ID không tồn tại" }))
    }
    let body = "";
    req.on("data", d => body += d.toString())
    req.on("end", () => {
        body = queryParser.decode(body)
        if (body.age < 15 || body.age > 100) {
            return res.end(JSON.stringify({ code: 1, message: "Tuổi không hợp lệ" }))
        }
        let student = students.get(id)
        if (body.name) {
            student.name = body.name
        }
        if (body.age) {
            student.age = body.age
        }
        students.set(id, student)
        return res.end(JSON.stringify({ code: 0, message: "Đã sửa thông tin sinh viên", data: student }))
    })


}

function findByIDAndDelete(req, res, id) {
    if (!students.has(id)) {
        return res.end(JSON.stringify({ code: 103, message: "ID không tồn tại" }))
    }

    const student = students.delete(id)
    return res.end(JSON.stringify({ code: 0, message: "Đã xóa sinh viên", data: student }))
}