const express = require('express')
const multiparty = require('multiparty')
var fs = require('fs')
const app = express()
const expressHandlebars = require('express-handlebars')
const port = 3000

const fortunes = [

    "Conquer your fears or they will conquer you.",
    
    "Rivers need springs.",
    
    "Do not fear what you don't know.",
    
    "You will have a pleasant surprise.",
    
    "Whenever possible, keep it simple.",
    
]

// configure Handlebars view engine

app.engine('handlebars', expressHandlebars.engine({

    defaultLayout: 'main',
    
}))
    
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public')) // use static file
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
    
    res.render('home')
})

app.get('/about', (req, res) => {

    const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
    
    res.render('about', { fortune: randomFortune })
    
    })

app.get('/register1', (req, res) => {

    res.render("register")
    
})

app.post('/register1', (req, res) => {

    console.log("nhận post")

    res.render("thankyou")
    
})

app.get('/register2', (req, res) => {
    
    res.render("register")
    
})

app.post('/register2', (req, res) => {

    console.log("nhận post")

    res.redirect(303,"thankyou")
    
})

app.get('/thankyou', (req, res) => {

    res.render("thankyou")

})


app.get('/vacation-photo', (req, res) => {
    res.render('vacation-photo')
})
app.post('/vacation-photo', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).send(err.message)
        console.log('field data: ', fields)
        console.log('files: ', files)
        fs.renameSync(files.photo[0].path, __dirname + "public/uploads/images/" + files.photo[0].originalFilename , function (err) {

            if (err) throw err;
            console.log('Successfully renamed - AKA moved!');
            
        })
        res.redirect(303, '/thankyou')
    })
})


// custom 404 page

app.use((req, res) => {

    res.status(404)

    res.render('404')

})

// custom 500 page

app.use((err, req, res, next) => {

    console.error(err.message)

    res.status(500)

    res.render('500')

})

app.listen(port, () => console.log(
    `express started on http://localhost:${port};` +
    `\npress Ctrl-C to terminate`
))

