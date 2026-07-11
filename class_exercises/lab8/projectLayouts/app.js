const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const {check, validationResult} = require("express-validator")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const cookieParser = require("cookie-parser")
const session = require("express-session")
const port = 3000

// configure Handlebars view engine

app.engine(
    "hbs",
    handlebars.engine({
      defaultLayout: "main",
      extname: ".hbs",
      helpers: {
        inc: function(value, options)
        {
            return parseInt(value) + 1;
        },
        VnGender: function(value, options) {
            if(value === "male") return "Nam"
            return "Nữ"
        },
        imageGender: (gender) => {
            if(gender == 'male') 
                return 'img_avatar3.png'
            return 'img_avatar4.png'
        },
        checkedMale: (gender) => {
            if(gender == 'male')
                return 'checked'
            return '' 
        },
        checkedFemale: (gender) => {
            if(gender == 'female')
                return 'checked'
            return '' 
        },
      },
    })
);
    
app.set('view engine', 'hbs')

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser('bai8'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(function(req, res, next){
    res.locals.student = req.session.student;
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    delete req.session.student;
    next();
});


const validator = [check('name').notEmpty().withMessage('Vui lòng nhập tên học sinh.'),
                check('gender').notEmpty().withMessage('Vui lòng chọn giới tính.'),
                check('age').notEmpty().withMessage('Vui lòng nhập tuổi học sinh.')
                .isNumeric().withMessage("Tuổi của học sinh phải là số"),
                check('email').notEmpty().withMessage('Vui lòng nhập email học sinh.')
                .isEmail().withMessage('Vui lòng nhập đúng email.'),
                check("class").notEmpty().withMessage('Vui lòng nhập lớp học sinh.'),
                check("address").notEmpty().withMessage('Vui lòng nhập địa chỉ học sinh.'),
                ]

app.get('/', (req, res) => {
    fetch('http://localhost:8080/', {
        method: 'get',
    })
    .then(res => res.json())
    .then(json => {
        if(json.code === 200) {
            res.render('home',{students: json.data})
        }
    })
    .catch(e => {
        console.log(e)
    })
})

app.post("/delete/:id", (req,res) => {
    if(!req.params.id) { 
        return res.json({code:1, message: 'Invalid id'})
    }
    let id = req.params.id
    fetch('http://localhost:8080/delete/' + id, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(json => {

        return res.json(json)
    })
    .catch(e => {
        return res.json({code:2, message: e.message})
    })
})

app.get('/add', (req, res) => { 
    res.render('add')
})

app.post('/add',validator,(req, res) => {
    const result = validationResult(req)
    let student = req.body

    if(result.errors.length > 0) {
        req.session.student = student
        req.session.flash = {
            type: "danger",
            message: result.errors[0].msg
        }
        res.redirect("/add")
    }
    else {
        fetch('http://localhost:8080/add', {
            method: 'post',
            body: JSON.stringify(student),
            headers: {'Content-Type': 'application/json'}
        })
        .then(result => result.json())
        .then(json => {
            if(json.code == 200) {
                req.session.flash = {
                    type: "success",
                    message: json.message + " "+ student.name
                }
                return res.redirect(303,'/')
            } else {
                req.session.student = student
                req.session.flash = {
                    type: "danger",
                    message: json.message
                }
                return res.redirect(303,'/add')
            }
        })
    }
})

app.get("/profile/:id", (req,res) => {
    fetch('http://localhost:8080/' + req.params.id, {
        method: "get"
    })
    .then(res => res.json())
    .then(json => {
        if(json.code !== 200) {
            req.session.flash = {
                message: json.message,
                type: "danger"
            }
            res.redirect("/")
        }
        else {
            student = json.data
            res.render("profile", {student})
        }
    })
})

app.post("/edit/:id", (req,res) => {
    const result = validationResult(req.body)
    if(!req.params.id) { 
        return res.json({code:1, message: 'Invalid id'})
    }else if(result.errors.length > 0) {
        return res.json({code:2, message: result.errors[0].msg})
    }
    let student = req.body
    fetch('http://localhost:8080/edit/'+req.params.id, {
        method: 'put',
        body: JSON.stringify(student),
        headers: {'Content-Type': 'application/json'}
    }).then(res => res.json())
    .then(json => {
        if(json.code === 200) {
            req.session.flash = {
                message: "Đã cập nhật người dùng " + student.name,
                type: "success"
            }
        }
        return res.json(json)
    })
    .catch(e => {
        return res.json({code:2, message: e.message})
    })
})

// custom error page
app.get("/error", (req,res) => {
    res.render("error")
})

// custom 404 page

app.use((req, res) => {
    res.status(404)
    res.redirect("error")
})

// custom 500 page

app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.redirect("error")
})

app.listen(port, () => console.log(
    `express started on http://localhost:${port};` + 
    `\npress Ctrl-C to terminate`
))

