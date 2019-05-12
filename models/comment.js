var mongoose = require("mongoose");


var commentSchema = new mongoose.Schema({
    comment: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    rating: Number,
    reply:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply"
    }],
    date: Date
})


module.exports = mongoose.model("Comment", commentSchema);