require("dotenv").config()
const express = require("express")
const handlebars = require("express-handlebars")
const session = require("express-session")
const cookie = require("cookie-parser")
const fs = require("fs")
const multer = require("multer")

const FileReader = require("./middlewares/FIleReader")

const UserRouter = require("./routers/UserRouter")
const FileRouter = require("./routers/FileRouter")

const uploader = multer({ dest: __dirname + "/uploads/" })

const app = express()

app.engine(
  "hbs",
  handlebars.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      getName: (filename, ext) => {
        return filename.replace(ext, "")
      }
    }
  })
);

app.set("view engine", "hbs");


app.use(express.json())
app.use(express.urlencoded())
app.use(cookie('Lab0607'));
app.use(session({ cookie: { maxAge: 6000000 } }));

app.use(function (req, res, next) {
  res.locals.flash = req.session.flash;
  res.locals.account = req.session.account;
  delete req.session.flash;
  delete req.session.account;
  next();
})

app.use((req, res, next) => {
  req.vars = { root: __dirname }
  next()
})

app.use("/", UserRouter)
app.use("/", FileRouter)

const getCurrentDir = (req, res, next) => {
  if (!req.session.user) {
    return next()
  }

  const { root } = req.session.user
  let { dir } = req.query || ""
  let currentDir = `${root}/${dir}`
  if (!fs.existsSync(currentDir)) {
    currentDir = root
  }
  req.vars.currentDir = currentDir
  req.vars.root = root
  next()
}

app.get("/", getCurrentDir, (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  let { root, currentDir } = req.vars
  FileReader.load(root, currentDir)
    .then(files => {
      let user = req.session.user
      res.render("index", { user, files, currentDir })
    })

})


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

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`http://localhost:${port}`))