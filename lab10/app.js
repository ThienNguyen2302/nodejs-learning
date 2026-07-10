const express = require('express')
const app = express()
const credentials = require("./credentials")
const session = require("express-session")
const cookie = require("cookie-parser")
const expressHandlebars = require('express-handlebars');
const port = 3000

// configure Handlebars view engine

app.engine('handlebars', expressHandlebars.engine({

    defaultLayout: 'main',
    
}))
    
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.use(cookie('bai10'));
app.use(session({ secret: "Secret!!!"}));

var auth = require('./lib/auth.js')(app, {
    providers: credentials.Auth,
    successRedirect: '/account' ,
    failureRedirect: '/unauthorized' ,
})
    
// auth. init() links in Passport middleware:
auth. init();
// now we can specify our auth routes:
auth. registerRoutes();

app.get("/login", (req,res) => {
    res.render("login")
})

app.get('/account' , function(req, res){
    if(!req.session.passport.user) res.render('account');
    return res.redirect(303, '/unauthorized');
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

