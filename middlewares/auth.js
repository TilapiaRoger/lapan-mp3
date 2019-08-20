module.exports = function(req, res, next){
    if (req.session.username){
        console.log("This user exists")
        next()
    }
    else{
        res.render("index", {
            error: error
        })
    }
}