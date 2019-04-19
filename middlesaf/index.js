var middlesafObj = {};

middlesafObj.isSafcorp = function(req, res, next){
    if(req.isAuthenticated()){


        console.log('dikko',safcorp);
        
            return next();
        
    }
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "You need to sign in to do that");
    res.redirect("/signup");
};



module.exports = middlesafObj;