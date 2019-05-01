var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

router.get('/', function(req,res){
    res.render("index");
})

router.get('/login', function(req,res){
    res.render("login");
})

router.get('/register', function(req,res){
    res.render("register");
})

router.post('/register', function(req,res){
    var newUser = new User({forum_name: req.body.forumName,username: req.body.username });

    User.findOne({username: req.body.username}, function(err,user){
        if(user){
            req.flash("error", "Username : " + req.body.username + "has been taken");
            res.redirect("/register");
        }
       
    })
    User.findOne({forum_name : req.body.forumName}, function(err,user){
        if(user){
            req.flash("error", "ForumName : " + req.body.forumName + "has been taken");
            res.redirect("/register");
        }
       
    })
    User.register(newUser,req.body.password, function(err,user){
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to Lookitup " + user.forum_name);
            res.redirect("/");
        })
    })
})

router.get('/logout', function(req,res){
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/")
})
module.exports = router;