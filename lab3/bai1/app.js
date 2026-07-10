const express = require('express')
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

    helpers: {
        createTable: function() {
            const m = 10
            var returnData = ''
            for (var i=0; i<m; i++) {
                table= "<tr>"
                for (var j=0; j<m; j++) {
                    let s = (i+1)*(j+1)
                    table = table + `<td style="text-align: center">${s}</td>`
                }
                table = table + "</tr>"
                returnData = returnData + table
            }
            return returnData
        },
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

    app.get('/register', (req, res) => {

        
        
        res.render("register")
        
        })

    app.post('/register', (req, res) => {

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
    `press Ctrl-C to terminate`
))

