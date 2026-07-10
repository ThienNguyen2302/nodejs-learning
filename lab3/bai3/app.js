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
        currency: function(price) {
        return '$' + price
        },

        bold: function(options) {
        return '<b>' + options.fn(this) + '</b>'
        },

        mytours: function(tours, options) {
            var len = tours.length
            var returnData = ''
            for (var i=0; i<len; i++) {
            tours[i].name = '<b>' + tours[i].name + '</b>'
            tours[i].price = '$' + tours[i].price
            returnData = returnData + options.fn(tours[i])
            }
            return returnData
        },
    },
    
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

app.get('/tours', (req, res) => {

    
    
    res.render('tours', 
    {currency: {
        name: 'United States dollars',
        abbrev: 'USD',
        },
        tours: [
        { name: 'Hood River', price: '99.95' },
        { name: 'Oregon Coast', price: '159.95' },
        ],
    specialsUrl: '/january-specials',
    currencies: null,
    }
    )
    
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

