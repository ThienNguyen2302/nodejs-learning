var express = require("express");
var router = express.Router();
var checkURL = require("../middlewares/CheckSearchURL")
var checkAuth = require("../middlewares/CheckAuthorize")
var checkParams = require("../middlewares/CheckParams")

router.get("/", (req, res) => {
    res.send("/sanpham")
});
router.get("/search/:keyword",checkURL, (req, res) => {
    res.send("/sanpham/search/:keyword")
});
router.post("/add/:id",checkAuth, checkParams, (req, res) => {
    res.send("/sanpham/add")
});
router.delete("/delete/:id",checkAuth, checkParams, (req, res) => {
    res.send("/sanpham/delete/:id")
});
router.put("/edit/:id",checkAuth, checkParams, (req, res) => {
    res.send("/sanpham/edit/:id")
});

module.exports = router;
