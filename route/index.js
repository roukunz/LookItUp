var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Category = require("../models/category")

router.get('/', function(req,res){
    res.render("index");
})

router.get('/login', function(req,res){
    res.render("login", {referer: req.headers.referer});
})

router.get('/register', function(req,res){
    res.render("register", {referer: req.headers.referer});
})

router.post('/register', function(req,res){
    var newUser = new User({forum_name: req.body.forumName,username: req.body.username });

    User.findOne({username: req.body.username}, function(err,user){
        if(user){
            req.flash("error", "Username : " + req.body.username + "has been taken");
            res.redirect("/register");
        }
       
    })
    User.register(newUser,req.body.password, function(err,user){
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to Lookitup " + user.forum_name);
            if (req.body.referer && (req.body.referer !== undefined && req.body.referer.slice(-6) !== "/login")) {
                res.redirect(req.body.referer);
            } else {
                res.redirect("/");
            }
        })
    })
})

router.post("/login",passport.authenticate("local",{
    failureRedirect:"/login"
}), function(req,res){
    if (req.body.referer && (req.body.referer !== undefined && req.body.referer.slice(-6) !== "/login")) {
        res.redirect(req.body.referer);
    } else {
        res.redirect("/");
    }
})

router.get('/logout', function(req,res){
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/")
})

router.post('/search', function(req,res){
    Category.findOne({name: req.body.search} ,function(err,category){
        res.redirect('/l/' + category.name);
    })
})
module.exports = router;