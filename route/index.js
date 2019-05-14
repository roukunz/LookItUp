var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Category = require("../models/category");
var Post = require("../models/post");

router.get('/', function(req,res){
    var lastFound;
    var newPost = [];
    Post.find({}).populate("category").exec( function(err, post){
        for(var i = 0; i < post.length; i++){
            if(newPost.length <= 4){
                newPost.push(post[i]);
            } else {
                lastFound = post[i];
                var temp;
                for(var y = 0; y < newPost.length; y++){
                    if(post[i].rating > newPost[y].rating){
                        temp = newPost[y];
                        newPost[y] = lastFound;
                        lastFound = temp;
                    }
                }
            }  
        }
        console.log("newpost that the player is getting: " + newPost);
        if(req.user){
            User.findOne({_id: req.user.id}, function(err,user){
                res.render("index", {topPost: newPost, user: user});
            })
        } else {
            res.render("index", {topPost: newPost});
        }
    })
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

    if(req.body.password != req.body.password2){
        req.flash("error","Password is not the same");
        res.redirect("back");
    } else {
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
    }
    
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
    var found = false;
    Category.findOne({name: req.body.search} ,function(err,category){
        console.log("found search: " +category);
        if(category){
            res.redirect('/l/' + category.name.toLowerCase());
        } else {
            res.redirect('/l/new');
        }
        found = true;
    })
})

router.get('*', function(req,res){
    res.redirect("/");
})
module.exports = router;