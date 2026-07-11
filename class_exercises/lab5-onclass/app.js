const express = require("express");
const multiparty = require("multiparty");

const fs = require("fs");

const credentials = require("./credentials.js");

const expressHandlebars = require("express-handlebars");

const { dirname } = require("path");

const Vacation = require("./models/Vacation.js");

const mongoose = require("mongoose");

const app = express();

const port = 3000;

app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");

app.use(require("cookie-parser")(credentials.cookieSecret)); // use cookie and sign up string
app.use(require("express-session")()); // use session
app.use(express.static(__dirname + "/public")); // use static file
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

switch (app.get("env")) {
  case "development":
    mongoose.connect(credentials.mongo.development.connectionString);
    break;
  case "production":
    mongoose.connect(credentials.mongo.production.connectionString);
    break;
  default:
    throw new Error("Unknown execution environment: " + app.get("env"));
}

Vacation.find(function (err, vacations) {
  if (vacations.length) return;

  new Vacation({
    name: "Hood River Day Trip",
    slug: "hood-river-day-trip",
    category: "Day Trip",
    sku: "HR199",
    description:
      "Spend a day sailing on the Columbia and " +
      "enjoying craft beers in Hood River!",
    priceInCents: 9995,
    tags: ["day trip", "hood river", "sailing", "windsurfing", "breweries"],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
  }).save();
});

const VALID_EMAIL_REGEX = "/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/";
const fortunes = [
  "Conquer your fears or they will conquer you.",

  "Rivers need springs.",

  "Do not fear what you don't know.",

  "You will have a pleasant surprise.",

  "Whenever possible, keep it simple.",
];

// configure Handlebars view engine

// custom middlewarew to access flash message
app.use(function (req, res, next) {
  // if there's a flash message, transfer
  // it to the context, then clear it
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  res.render("about", { fortune: randomFortune });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  var name = req.body.name || "",
    email = req.body.email || "";
  // input validation
  if (!email.match(VALID_EMAIL_REGEX)) {
    if (req.xhr) return res.json({ error: "Invalid name email address." });
    req.session.flash = {
      type: "danger",
      intro: "Validation error!",
      message: "The email address you entered was not valid.",
    };
    return res.redirect(303, "thankyou");
  }
  if (req.xhr) return res.json({ success: true });
  req.session.flash = {
    type: "success",
    intro: "Thank you!",
    message: "You have now been signed up for the newsletter.",
  };
  return res.redirect(303, "home");
  // new NewsletterSignup({ name: name, email: email }).save(function(err){
  //     if(err) {
  //         if(req.xhr) return res.json({ error: 'Database error.' });
  //         req.session.flash = {
  //             type: 'danger',
  //             intro: 'Database error!',
  //             message: 'There was a database error; please try again later.',
  //         }
  //         return res.redirect(303, '/newsletter/archive');
  //     }
  //     if(req.xhr) return res.json({ success: true });
  //         req.session.flash = {
  //             type: 'success',
  //             intro: 'Thank you!',
  //             message: 'You have now been signed up for the newsletter.',
  //         };
  //         return res.redirect(303, '/newsletter/archive');
  //     });
});

app.get("/vacations", function (req, res) {
  Vacation.find({ available: true }, function (err, vacations) {
    var context = {
      vacations: vacations.map(function (vacation) {
        return {
          sku: vacation.sku,
          name: vacation.name,
          description: vacation.description,
          price: vacation.getDisplayPrice(),
          inSeason: vacation.inSeason,
        };
      }),
    };
    res.render("vacations", context);
  });
});

app.get("/thankyou", (req, res) => {
  res.render("thankyou");
});

app.get("/vacation-photo", (req, res) => {
  res.render("vacation-photo");
});

app.post("/vacation-photo", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send(err.message);
    console.log("field data: ", fields);
    console.log("files: ", files);
    fs.renameSync(
      files.photo[0].path,
      -dirname + "/public/uploads/images/" + files.photo[0].originalFilename,
      function (err) {
        if (err) throw err;
        console.log("Successfully renamed - AKA moved!");
      }
    );
    res.redirect(303, "/thankyou");
  });
});

// custom 404 page

app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// custom 500 page

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500);
  res.render("500");
});

app.listen(port, () =>
  console.log(
    `express started on http://localhost:${port};` +
      `\npress Ctrl-C to terminate`
  )
);
