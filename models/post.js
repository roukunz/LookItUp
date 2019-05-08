var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    rating: [{
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }],
    dislike: [{
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }],     
    date: Date
})

module.exports = mongoose.model("Post",postSchema);