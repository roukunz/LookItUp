var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware/index");

var Category = require("../models/category");
var User = require("../models/user")

router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render("category/new");
})

router.post('/new', middleware.isLoggedIn, function(req,res){
    Category.create(req.body.category, function(err, category){
        if(err){
            console.log(err);
            res.redirect("/");
        }
        category.name = category.name.toLowerCase();

        category.creator.id = req.user._id;
        category.creator.username = req.user.username;

        category.save();

        res.redirect("/l/"+ category.name);
    })
})

router.get('/:id', function(req,res){
    Category.findOne({name: req.params.id}).populate("post").exec(function(err,category){
        
        if(req.user){
            User.findOne({username: req.user.username}, function(err, user){

                res.render("category/show", {category: category, user_rate: user.ratedPost})
            })
        } else {
            res.render("category/show",{category: category});
        }
    })
})
module.exports = router;