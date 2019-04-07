var mongoose = require("mongoose");

var ratingSchema = new mongoose.Schema({
    rating: Number,
    author:{
        id:{    
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    campId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Campground'
    }

});

module.exports = mongoose.model("Rating", ratingSchema);