const http = require("http");
const URL = require("url");
const queryString = require("querystring");
const fs = require("fs");
const path = require("path");

const sever = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    const url = URL.parse(req.url)
    let responsePage = ""

    if (url.pathname === "/") {
        responsePage = fs.readFileSync(path.join(__dirname, "views/login.html"))
        return res.end(html)
    }
    else if (url.pathname === "/login") {
        handleLogin(req, res);
    }
    else {
        responsePage = fs.readFileSync(path.join(__dirname, "views/error.html"))
        return res.end(html)
    }

    function handleLogin(req, res) {
        let responsePage = ""
        if (req.method !== "POST") {
            responsePage = fs.readFileSync(path.join(__dirname, "views/fail.html")).toString();
            responsePage = responsePage.replace("Tài khoản không hợp lệ", `Phương thức ${req.method} không được hỗ trợ`);
            return res.end(responsePage);
        }
        let body = "";
        responsePage = fs.readFileSync(path.join(__dirname, "views/fail.html"))
        req.on('data', d => body += d.toString());
        req.on('end', () => {
            body = queryString.decode(body);
            if (!body.email) {
                return res.end(responsePage)
            }
            else if (!body.pass) {
                return res.end(responsePage)
            }
            else {
                responsePage = fs.readFileSync(path.join(__dirname, "views/success.html"))
                return res.end(responsePage)
            }
        })
    }

}).listen(8080, () => {
    console.log("Sever is running at http://localhost:8080")
});