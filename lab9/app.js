const https = require("https")
const express = require('express')
const app = express()
const expressHandlebars = require('express-handlebars')
const port = 3000
const static = require("./lib/static").map
const fs = require("fs")

const fortunes = [

    "Conquer your fears or they will conquer you.",
    
    "Rivers need springs.",
    
    "Do not fear what you don't know.",
    
    "You will have a pleasant surprise.",
    
    "Whenever possible, keep it simple.",
    
    ]

       
// configure Handlebars view engine

app.use((req,res,next) => {
    var now = new Date()
    res.locals.logoImage = now.getMonth() == 11 && now.getDate == 19?
        static("/img/logo_new.png") : static("/img/logo.png")
    next()
})

app.engine('handlebars', expressHandlebars.engine({

    defaultLayout: 'main',
    helpers: {
        static: function(name) {
            return require("./lib/static").map(name)
        }
    }
    
}))
    
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    
    res.render('home')
})

app.get('/about', (req, res) => {

    const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
    
    res.render('about', { fortune: randomFortune })
    
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

var options = {
    key: fs. readFileSync(__dirname + '/ssl/meadowlark.pem'),
    cert: fs. readFileSync(__dirname + '/ssl/meadowlark.crt' )
}

https.createServer(options, app).listen(port, function(){
    console. log( ' Express started in ' + app.get('env' ) +
    'mode on port ' + port + ' . ');
})
