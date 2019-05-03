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
    rating: Number,
    date: Date
})

module.exports = mongoose.model("Post",postSchema);