var mongoose = require("mongoose");
  


var UserSchema = new mongoose.Schema({
    username: String,
    email: {type: String, unique: true },
    password: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }]
});




module.exports = mongoose.model("User", UserSchema);