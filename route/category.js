var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware/index");

var Category = require("../models/category");

router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render("category/new");
})

router.post('/new', middleware.isLoggedIn, function(req,res){
    Category.create(req.body.category, function(err, category){
        if(err){
            console.log(err);
            res.redirect("/");
        }

        category.creator.id = req.user._id;
        category.creator.username = req.user.username;

        category.save();

        res.redirect("/l/"+ category.name);
    })
})

router.get('/:id', function(req,res){
    Category.findOne({name: req.params.id}).populate("post").exec(function(err,category){
            res.render("category/show",{category: category});
    })
})
module.exports = router;