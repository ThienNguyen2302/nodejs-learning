const keyword =  (req,res,next) => {
    if(!req.params.keyword) {
        return res.send("Chưa có keyword")
    }
    next()
}

module.exports = keyword