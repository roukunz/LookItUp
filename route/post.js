var express = require("express");
var router = express.Router({mergeParams: true});
var Category = require("../models/category");
var Post = require("../models/post");
var middleware = require("../middleware/index");
var User = require("../models/user")

router.get('/new', middleware.isLoggedIn, function(req,res){
    Category.findOne({name:req.params.id}, function(err,category){

        res.render("post/new", {category_name: category.name});
    })
})

router.post('/', middleware.isLoggedIn, function(req,res){
    Category.findOne({name: req.params.id}, function(err, category){
        if(err){
            console.log(err);
        }
        Post.create(req.body.post,function(err,post){
            post.author.id = req.user._id;
            post.author.username = req.user.username;
            post.rating = 0;
            post.date = new Date();

            post.save();

            category.post.push(post);
            category.save();

            res.redirect("/l/" + category.name);
        })
    }) 
})

router.post('/:title/like', middleware.isLoggedIn, function(req,res){
    User.findOne({username: req.user.username},function(err,user){
        Post.findOne({title: req.params.title}, function(err ,post){
            var found;
            user.ratedPost.every(function(u){
               
                if(u._id.toString() === post._id.toString()){
                    res.redirect("/l/"+req.params.id);
                    found = true;
                    console.log("here");
                    return false;
                }
                return true;
            })
            if(!found){
                post.rating += 1;
                post.save();
    
                user.ratedPost.push(post);
                user.save();
                res.redirect("back");
            }
        })
    })
    
})
module.exports = router;