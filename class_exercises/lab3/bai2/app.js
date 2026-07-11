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

const tours = [

    { id: 0, name: 'Hood River', price: 99.99 },
    
    { id: 1, name: 'Oregon Coast', price: 149.95 },
    
    ]

// configure Handlebars view engine

app.engine('handlebars', expressHandlebars.engine({

    defaultLayout: 'main',
    
}))
    
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {

    const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
    
    res.render('about', { fortune: randomFortune })
    
    })

//GET endpoint that returns JSON, XML, or text
app.get('/api/tours', (req, res) => {

    const toursXml = '<?xml version="1.0"?><tours>' +
    
    tours.map(p =>
    
    `<tour price="${p.price}" id="${p.id}">${p.name}</tour>`
    
    ).join('') + '</tours>'
    
    const toursText = tours.map(p =>
    
    `${p.id}: ${p.name} (${p.price})`
    
    ).join('\n')
    
    res.format({
    
    'application/json': () => res.json(tours),
    
    'application/xml': () => res.type('application/xml').send(toursXml),
    
    'text/xml': () => res.type('text/xml').send(toursXml),
    
    'text/plain': () => res.type('text/plain').send(toursText),
    
    })
    
    })

//PUT endpoint for updating

app.put('/api/tour/:id', (req, res) => {

    const p = tours.find(p => p.id === parseInt(req.params.id))
    
    if(!p) return res.status(404).json({ error: 'No such tour exists' })
    
    if(req.body.name) p.name = req.body.name
    
    if(req.body.price) p.price = req.body.price
    
    res.json({ success: true })
    
    })
    
//DELETE endpoint for deleting
app.delete('/api/tour/:id', (req, res) => {

    const idx = tours.findIndex(tour => tour.id === parseInt(req.params.id))
    
    if(idx < 0) return res.json({ error: 'No such tour exists.' })
    
    tours.splice(idx, 1)
    
    res.json({ success: true })
    
    })
    
//get endpoint for find tour
app.get('/api/tour/:id', (req, res) => {
    const p = tours.find(p => p.id === parseInt(req.params.id))
    
    if(!p) return res.status(404).json({ error: 'No such tour exists' })

    res.json({ success: true, tour: p })
})

//post endpoint for add tour
app.post('/api/tour', (req, res) => {
    const tour = {
        id: tours.length +1,
        name: req.body.name,
        price: parseFloat(req.body.price)
    };

    tours.push(tour)
    res.json({ success: true, tour: tour })
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

