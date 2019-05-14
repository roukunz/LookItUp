var express = require("express");
var mongoose = require("mongoose");
var router = express.Router({mergeParams: true});
var Category = require("../models/category");
var Post = require("../models/post");
var middleware = require("../middleware/index");
var User = require("../models/user")
var Comment = require("../models/comment");
var Reply = require("../models/reply");

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
            post.category = category;
            post.save();

            post.date = new Date();

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
            post.dislike.every(function(d,i){
                if(user._id.toString() == d._id.toString()){
                    found = true;
                    user.ratedPost.every(function(r,y){
                        console.log(r.post._id);
                        if(r.post._id.toString() == post._id.toString()){
                            
                            user.ratedPost.splice(y,1);
                            user.save();
                        }
                    })
                    post.dislike.splice(i,1);
                    post.save();
                    res.redirect("back");
                    return false;
                }
                return true;
            })

            user.ratedPost.every(function(r,i){
                if(post._id.toString() == r.post._id.toString()){
                    user.ratedPost.splice(i,1);
                    user.save();
                }
            })

            if(!found){
                post.rating.every(function(p){
                    if(user._id.toString() == p._id.toString()){
                        res.redirect("back");
                        found = true;
                        return false;
                    }
                    return true;
                })
            }

            if(!found){    
                var dataSend = {
                    post: post, 
                    like: true
                }
                user.ratedPost.push(dataSend);
                post.rating.push(req.user._id);
                post.save();
                user.save();
                res.redirect("back");
            }
            

        })
    })
})

router.post('/:title/dislike', middleware.isLoggedIn,function(req,res){
    var found = false;
    //check if they like
    User.findOne({username: req.user.username},function(err,user){
        Post.findOne({title: req.params.title}, function(err ,post){
            

            post.rating.every(function(p,i){
                if(user._id.toString() == p._id.toString()){
                    //if they do, delete their like
                    user.ratedPost.every(function(r,y){
                        if(r.post._id.toString() == post._id.toString()){
                            user.ratedPost.splice(y,1);
                            user.save();
                            console.log(user.ratedPost[y]);
                        }
                    })

                    post.rating.splice(i,1);
                    post.save();

                  
                    found = true;
                    res.redirect("back");
                    return false;
                }
                return true;
            })

            user.ratedPost.every(function(r,i){
                if(r.post._id.toString() == post._id.toString()){
                    user.ratedPost.splice(y,1);
                    user.save();
                }
            })

              //if they click again, or they didnt rate yet, dislike
            if(!found){
                post.dislike.every(function(d){
                    if(user._id.toString() == d._id.toString()){
                        found = true;
                        console.log("here");
                        res.redirect("back");
                        return false;
                    }
                    return true;
                })
            }

            if(!found){
                var dataSend = {
                    post: post, 
                    like: false
                }
                user.ratedPost.push(dataSend);
                user.save();
                post.dislike.push(user._id);
                post.save();
                res.redirect('back');
            }
            
            })
        })
    })

router.get("/:title", function(req,res){
    Category.findOne({name: req.params.id}, function(err,category){
        Post.findOne({title: req.params.title}).populate({
            path: 'comment',
            model: 'Comment',
            populate:{path: 'reply', model:"Reply"}  
        }).exec(function(err,post){
            if(req.user){
                User.findOne({username: req.user.username}).exec(function(err,user){
                    console.log(user._id);
                    console.log(post.author.id);
                    res.render("post/show", {post: post, user: user, user_rate: user.ratedPost, user_comment_rate: user.ratedComment, category: category});
                })
            } else {
                res.render("post/show", {post: post, category: category});
            }
        }) 
    })
})

router.get('/:title/edit', middleware.isLoggedIn, function(req,res){
    Category.findOne({name: req.params.id}, function(err,category){
        Post.findOne({title: req.params.title}, function(err,post){

            res.render("post/edit", {post: post, category: category});
        })
    })
   
})

router.put('/:title', middleware.checkPostAuthor, function(req,res){
    Post.findOne({title: req.params.title}, function(err, post){
        if(err){
            console.log(err);
        } else {
            post.title = req.body.title;
            post.content = req.body.content;
            post.save();
            res.redirect("/l/" + req.params.id+ "/post/" + req.params.title);
        }
    })
})

router.delete("/:title", middleware.checkPostAuthor, function(req,res){
    Post.findOne({title: req.params.title}).populate({path: 'comment',
    model: 'Comment',
    populate:{path: 'reply', model:"Reply"}  }).exec( function(err,post){
        for(var i = 0; i < post.comment.length; i++){
            for(var y = 0; y < post.comment[i].reply.length; y++){
                Reply.remove({_id: post.comment[i].reply[y]._id}, function(err,removed){
                    if(err){
                        console.log(err);
                    }
                });
            }
            Comment.remove({_id: post.comment[i]._id}, function(err,removed){});
        }
        Post.remove({_id: post._id}, function(err,removed){});
    })

    res.redirect("/l/"+ req.params.id);

})
module.exports = router;