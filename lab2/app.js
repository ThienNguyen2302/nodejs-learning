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

}))

app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    const row = 10, column = 10

    let table = "<table style='border: 1px solid'>\n"



    for (let i = 0; i < row; i++) {
        table += "<tr style='border: 1px solid'>\n"
        for (let j = 0; j < column; j++) {
            table += "<td style='border: 1px solid'> " + (i + 1) * (j + 1) + " </td>\n"
        }
        table += "</tr>\n"
    }

    table += "</table>"
    res.render('home', { table: table })
})

app.get('/about', (req, res) => {

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]

    res.render('about', { fortune: randomFortune })

})

app.get('/if', (req, res) => {


    res.render('if_helper', {
        author: true,
        firstName: "Yehuda",
        lastName: "Katz",
    })

})

// unless helper
app.get('/unless', (req, res) => {


    res.render('unless_helper', {})

})

// each helper

app.get('/each', (req, res) => {


    res.render('each_helper', {
        peoples: [
            "Yehuda Katz",
            "Alan Johnson",
            "Charles Jolley",
        ],

    })

})

// WITH HELPER 
app.get('/with', (req, res) => {


    res.render('with_helper', {
        person: {
            firstname: "Yehuda",
            lastname: "Katz",
        },

    })

})

// lookup helper
app.get('/lookup', (req, res) => {


    res.render('lookup_helper', {
        people: ["Nils", "Yehuda"],
        cities: [
            "Darmstadt",
            "San Francisco",
        ],

    })

})

// log helper
app.get('/log', (req, res) => {


    res.render('log_helper', {
        firstname: "Yehuda",
        lastname: "Katz",

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
    `press Ctrl-C to terminate`
))

