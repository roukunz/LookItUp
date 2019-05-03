var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    access: String,
    creator: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
})

module.exports = mongoose.model("Category", categorySchema); 