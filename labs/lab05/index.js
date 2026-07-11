const express = require("express")
const handlebars = require("express-handlebars")
const https = require("https")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const parser = require("./middlewares/MyParser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const { check, validationResult } = require("express-validator")
const rateLimit = require('express-rate-limit')
const app = express()

app.engine('handlebars', handlebars.engine({

    defaultLayout: 'main',
    helpers: {
        inc: function (value, options) {
            return parseInt(value) + 1;
        },

        VnGender: function (value, options) {
            if (value === "male") return "Nam"
            return "Nữ"
        },
        imageGender: (gender) => {
            if (gender == 'male')
                return 'img_avatar3.png'
            return 'img_avatar4.png'
        },
        checkedMale: (gender) => {
            if (gender == 'male')
                return 'checked'
            return ''
        },
        checkedFemale: (gender) => {
            if (gender == 'female')
                return 'checked'
            return ''
        }
    }

}))
app.set('view engine', 'handlebars')

app.use(cookieParser('Lab05'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(function (req, res, next) {
    res.locals.errorFlash = req.session.errorFlash;
    res.locals.user = req.session.user;
    res.locals.successFlash = req.session.successFlash;
    delete req.session.errorFlash;
    delete req.session.successFlash;
    delete req.session.user;
    next();
});
app.use(express.json())

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}))

const validator = [check('name').notEmpty().withMessage('Vui lòng nhập tên người dùng.'),
check('gender').notEmpty().withMessage('Vui lòng chọn giới tính.'),
check('age').notEmpty().withMessage('Vui lòng nhập tuổi người dùng.'),
check('email').notEmpty().withMessage('Vui lòng nhập email người dùng.')
    .isEmail().withMessage('Vui lòng nhập đúng email.')]

// home page
app.get('/', (req, res) => {
    const content = {
        hostname: "web-nang-cao.herokuapp.com",
        path: "/lab5/users",
        port: 443,
        method: "GET"
    }
    const request = https.request(content, response => {
        let body = ''
        response.on('data', (d) => { body += d.toString() })
        response.on('end', () => {
            const users = JSON.parse(body)
            res.render('index', { users })
        })
        response.on('error', (err) => { console.log(e) })
    }
    )

    request.on('error', err => { console.log(err) })
    request.end();
})

app.get('/add', (req, res) => {
    res.render('add')
})


app.post('/add', parser, validator, (req, res) => {
    const result = validationResult(req)
    let { name, age, email, gender } = req.body

    if (result.errors.length > 0) {
        req.session.errorFlash = result.errors[0].msg
        req.session.user = {
            name: name,
            age: age,
            email: email,
            gender: gender
        }
        res.redirect("/add")
    }
    else {
        const user = {
            name: req.body.name,
            age: parseInt(req.body.age),
            email: req.body.email,
            gender: req.body.gender
        }

        fetch('https://web-nang-cao.herokuapp.com/lab5/users', {
            method: 'post',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(result => result.json())
            .then(result => {
                if (result.code == 0) {
                    req.session.successFlash = result.message
                    return res.redirect(303, '/')
                } else {
                    req.session.errorFlash = result.message
                    return res.redirect(303, '/add')
                }
            })
    }
})

app.post('/delete/:id', (req, res) => {

    if (!req.params.id) {
        return res.json({ code: 1, message: 'Invalid id' })
    }
    let id = req.params.id
    fetch('https://web-nang-cao.herokuapp.com/lab5/users/' + id, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(json => {
            return res.json(json)
        })
        .catch(e => {
            return res.json({ code: 2, message: e.message })
        })
})

// not done yet
app.post('/edit/:id', validator, (req, res) => {
    const result = validationResult(req.body)
    if (!req.params.id) {
        return res.json({ code: 1, message: 'Invalid id' })
    } else if (result.errors.length > 0) {
        return res.json({ code: 2, message: result.errors[0].msg })
    }
    let id = req.params.id
    let { name, age, email, gender } = req.body
    user = {
        id: id,
        name: name,
        age: age,
        email: email,
        gender: gender
    }
    fetch('https://web-nang-cao.herokuapp.com/lab5/users', {
        method: 'put',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
        .then(json => {
            if (json.code === 0) {
                req.session.successFlash = "Đã cập nhật người dùng " + name
            }
            return res.json(json)
        })
        .catch(e => {
            return res.json({ code: 2, message: e.message })
        })
})

app.get("/profile/:id", (req, res) => {
    fetch('https://web-nang-cao.herokuapp.com/lab5/users/' + req.params.id, {
        method: "get"
    })
        .then(res => res.json())
        .then(json => {
            if (json.code !== 0) {
                req.session.errorFlash = "Không tìm thấy người dùng"
                res.redirect("/")
            }
            else {
                user = json.data
                res.render("profile", { user })
            }
        })
})

// custom 404 page

app.get('/error', (req, res) => {
    res.render('error')
})

app.use((req, res) => {

    res.status(404)
    res.redirect('/error')

})


// custom 500 page

app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.redirect('/error')
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(
    `express started on http://localhost:${port};` +
    `\npress Ctrl-C to terminate`
))