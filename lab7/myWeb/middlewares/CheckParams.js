const id =  (req,res,next) => {
    if(!req.params.id) {
        return res.send("Chưa có id")
    }
    next()
}

module.exports = id