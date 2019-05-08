var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    forum_name: String,
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    ratedPost: [{
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }, 
        like: Boolean
    }],
    ratedComment: [{
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        like: Boolean
    }],
    subscribed:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);