var express = require("express");
var router = express.Router();
var fs = require("fs");
var session = require("express-session");
var formidable = require("formidable");
var VacationPhoto = require("../models/VacationPhoto");

router.use(session({ secret: "secret_password_here" }));

function saveContestEntry(name, desc, price, photoPath) {
  // TOO0...this will come later
  // price = parseInt(price)
  const vacation = VacationPhoto.create({
    name,
    desc,
    price,
    photoPath
  });
}

router.use(function (req, res, next) {
  // if there's a flash message, transfer
  // it to the context, then clear it
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

router.get("/vacation-photo", (req, res) => {
  res.render("vacationphoto");
});

router.post("/vacation-photo", function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    // if (err) return res.redirect(303, "/error");
    if (err) {
      res.session.flash = {
        type: "danger",
        intro: "Oops!",
        Message:
          "There was an error processing your submission. " +
          "Pelase try again.",
      };
      return res.redirect(303, "/vacation-photo");
    }
    var photo = files.photo;
    var dir = __dirname.replace("routes", "public") + "/data/vacation-photo";
    var path = dir + "/" + photo.originalFilename;
    // fs.mkdirSync(dir);
    console.log(photo.filepath);
    fs.renameSync(photo.filepath, dir + `/${photo.originalFilename}`);
    saveContestEntry(fields.name, fields.desc, fields.price, path);
    req.session.flash = {
      type: "success",
      intro: "Good luck!",
      message: "You have been entered into the contest.",
    };
    return res.redirect(303, "/vacation-photo");
  });
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
