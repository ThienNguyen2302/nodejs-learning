var express = require("express")
var router = express.Router();
var checkAuth = require("../middlewares/CheckAuthorize")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  const { email, pass } = req.body;
  req.session.user = email
  res.redirect("/")
});

module.exports = router;
