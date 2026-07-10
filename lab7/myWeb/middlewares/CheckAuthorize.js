
const authorize =  (req,res,next) => {
    if(!req.session.user) {
        res.end('only admin can post, put, delete')
    }
    next()
}
module.exports = authorize