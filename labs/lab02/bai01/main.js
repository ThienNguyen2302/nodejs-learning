const http = require('http');
const URL = require("url");
const queryString = require("querystring")

const sever = http.createServer(function (req, res) {
    const url = URL.parse(req.url)

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (url.pathname === "/") {

        res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <form action="/result" method="get">
                <table>
                    <tr>
                        <td>Số hạng 1</td>
                        <td><input type="text" name="a" placeholder = "Số hạng 1"></td>
                    </tr>
                    <tr>
                        <td>Số hạng 2</td>
                        <td><input type="text" name="b" placeholder = "Số hạng 2"></td>
                    </tr>
                    <tr>
                        <td>Phép tính</td>
                        <td>
                            <select name="op">
                                <option value="">Chọn phép tính</option>
                                <option value="+">Cộng</option>
                                <option value="-">Trừ</option>
                                <option value="*">Nhân</option>
                                <option value="/">Chia</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button type="submit">Tính</button></td>
                    </tr>
                </table>
            </form>
        </body>
        </html>
    `);
    }

    if (url.pathname === "/result") {
        let query = queryString.decode(url.query);

        if (!query.a) {
            res.end("bạn chưa nhập số hạng đầu tiên");
        }
        else if (!query.b) {
            res.end("Bạn chưa nhập số hạng thứ hai");
        }
        else if (!query.op) {
            res.end("Bạn chưa chọn phép tính");
        }
        else {
            let ops = ["+", "-", "*", "/"]
            if (!ops.includes(query.op)) {
                res.end("Phép tính không hợp lệ")
            }
            let a = parseInt(query.a);
            let b = parseInt(query.b);
            let kq;
            if (query.op === "+") {
                kq = a + b;
            }
            else if (query.op === "/") {
                if (b === 0) {
                    res.end("Không thể chia cho số 0");
                }
                kq = a / b;

            }
            else if (query.op === "-") {
                kq = a - b;
            }
            else if (query.op === "*") {
                kq = a * b;
            }
            res.end(`Kết quả: ${a} ${query.op} ${b} = ${kq}`);
        }
    }
    else {
        res.end("Trang này chưa được hỗ trợ")
    }
}).listen(8080, () => {
    console.log("Sever is running at http://localhost:8080")
});