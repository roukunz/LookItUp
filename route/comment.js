var express = require("express");
var router = express.Router({mergeParams: true});
var Category = require("../models/category");
var Post = require("../models/post");
var middleware = require("../middleware/index");
var User = require("../models/user");
var Comment = require("../models/comment");
var Reply = require("../models/reply")


//only content is sent
router.post("/", middleware.isLoggedIn, function(req,res){
    Post.findOne({title: req.params.title}, function(err,post){
        var comment = new Comment({
            "comment" : req.body.comment,
            "author" : {
                "id" : req.user._id,
                "username" : req.user.username
            },
            "rating" : 0,
            "reply" : [],
            "date" : new Date()
        })
        comment.save();

        post.comment.push(comment._id);
        post.save();
        res.redirect("back");
    })
})


router.post("/:comment/like", middleware.isLoggedIn, function(req,res){
    Comment.findOne({_id: req.params.comment}, function(err,comment){
        User.findOne({_id: req.user._id}).exec(function(err,user){
            var found = false;
            //if user dislike, remove dislike
            console.log("rated comment's legnth : " + user.ratedComment.length);
            user.ratedComment.every(function(r,i){
                console.log(r._id);
                console.log(comment._id);
                if(r._id.toString() == comment._id.toString()){
                    
                    //if the player liked already
                    if(r.like){
                        console.log("LIke");
                        res.redirect("back");
                        found = true;
                        return false;
                    } else {
                        user.ratedComment.splice(i,1);
                        user.save();

                        comment.rating += 1;
                        comment.save();

                        res.redirect("back");
                        found = true;
                        return false
                    }
                }
                return true;
                
            })

            console.log(found);
            if(!found){
                comment.rating += 1;
                comment.save();

                var newRate = {
                    "_id": comment._id,
                    "like": true
                }
                user.ratedComment.push(newRate);
                user.save();

                res.redirect("back");
            }
        })
    })
})

router.post("/:comment/dislike",middleware.isLoggedIn, function(req,res){
    Comment.findOne({_id: req.params.comment}, function(err,comment){
        User.findOne({username: req.user.username}).exec(function(err,user){
            var found = false;
            //if user dislike, remove dislike
            user.ratedComment.every(function(r,i){
                if(!found){
                    if(r._id.toString() == comment._id.toString()){
                        //if the player liked already
                        if(!r.like){
                            res.redirect("back");
                            found = true;
                        } else {
                            user.ratedComment.splice(i,1);
                            user.save();

                            comment.rating -= 1;
                            comment.save();

                            res.redirect("back");
                            found = true;
                        }
                    }
                }
            })

            if(!found){
                comment.rating -= 1;
                comment.save();

                var newRate={
                    "_id": comment._id,
                    "like": false
                }
                user.ratedComment.push(newRate);
                user.save();

                res.redirect("back");
            }
        }) 
    })
})

router.post("/:comment", middleware.isLoggedIn, function(req,res){
    Comment.findOne({_id: req.params.comment}, function(err,comment){
        var newComment = new Reply({
            "reply" : req.body.reply,
            "author" : {
                "id": req.user._id,
                "username": req.user.username
            },
            "date" : new Date()
        })
        newComment.save();

        comment.reply.push(newComment._id);
        comment.save();

        res.redirect("back");
    })
})


router.put("/:comment", middleware.checkCommentAuthor, function(req,res){
    Comment.findOne({_id: req.params.comment}, function(err, comment){
        comment.comment = req.body.comment;
        comment.save();
        res.redirect("back");
    })
})

router.put("/:comment/:reply", middleware.checkReplyAuthor, function(req,res){
    Reply.findOne({_id: req.params.reply}, function(err,reply){
        reply.reply = req.body.reply;
        reply.save();
        res.redirect("back");
    })
})

router.delete("/:comment", middleware.checkCommentAuthor, function(req,res){
    Comment.findOne({_id: req.params.comment}, function(err, comment){
        for(var i = 0; i < comment.reply.length; i++){
            Reply.remove({_id : comment.reply[i]._id},function(err,removed){})
        }
        Comment.remove({_id: comment._id},function(err,removed){});
        res.redirect("back");
    })
   
})

router.delete("/:comment/:reply", middleware.checkReplyAuthor, function(req,res){
    Reply.findOne({_id: req.params.reply}, function(err,reply){
        Reply.remove({_id: reply._id},function(err,removed){})
        res.redirect("back");
    })
})

module.exports = router;