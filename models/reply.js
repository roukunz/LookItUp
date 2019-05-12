var mongoose = require("mongoose");


var replySchema = new mongoose.Schema({
    reply: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: Date
})


module.exports = mongoose.model("Reply", replySchema);