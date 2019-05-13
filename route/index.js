var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Category = require("../models/category")

router.get('/', function(req,res){
    Category.find({},function(err,category){
        Post.find({}, function(err,post){
            var postNew = [];
            for(var i = 0; i < post.length; i++){
                if(postNew.length <= 5){
                    postNew.push(post);
                } else {
                    if(post[i].rating.length > postNew[postNew.length-1]){
                        var lastFound;
                        for(var y = postNew.length - 1; y < postNew.length; y++){
                            if(post[i].rating.length > postNew[y]){
                                lastFound = y;
                            }
                        }
                        var postHolder;
                        var temp;
                        postHolder = postNew[lastFound];
                        postNew[lastFound] = post[i];

                        for(var y = lastFound+1; y < postNew.length; y++){
                            temp = postNew[y];
                            postNew[y] = postHolder;
                            postHolder = temp;
                        }
                    }
                }
            }

            res.render("index", {category: category, topPost: postNew});
        })
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
    var found = false;
    Category.findOne({name: req.body.search} ,function(err,category){
        console.log(category);
        if(category){
            res.redirect('/l/' + category.name.toLowerCase());
        }
    }) 
    if(!found){
        res.redirect('/l/new');
    }
})

router.get('*', function(req,res){
    res.redirect("/");
})
module.exports = router;