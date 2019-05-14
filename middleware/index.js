var middlewareObj = {};

var Post = require("../models/post");
var Comment = require("../models/comment");
var Reply = require("../models/reply");

middlewareObj.checkPostAuthor = function(req,res,next){
    if(req.isAuthenticated()){
        Post.findOne({_id: req.params.title},function(err, foundPost){
            if(err){
                res.redirect("back") 
                }else {
                    
                 //does user own campground
                 if(foundPost.author.id.equals(req.user._id)){
                    next();
                 } else {
                res.redirect("back");
                 }
            }
        })
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentAuthor = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findOne({_id: req.params.comment},function(err, foundComment){
            if(err){
                res.redirect("back") 
                }else {
                    console.log(foundComment);
                    
                 //does user own campground
                 if(foundComment.author.id.equals(req.user._id)){
                    next();
                 } else {
                res.redirect("back");
                 }
            }
        })
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkReplyAuthor = function(req,res,next){
    if(req.isAuthenticated()){
        Reply.findOne({_id: req.params.reply},function(err, foundReply){
            if(err){
                res.redirect("back") 
                }else {
                    
                 //does user own campground
                 if(foundReply.author.id.equals(req.user._id)){
                    next();
                 } else {
                res.redirect("back");
                 }
            }
        })
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj