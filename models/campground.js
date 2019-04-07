var mongoose = require("mongoose");

var campgroundSchema= new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    //price: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, //adding a ref to comment
            ref: "Comment"   //name of the model
        }
    ],
    ratings: [
        {
            
            type: mongoose.Schema.Types.ObjectId, //adding a ref to rating
            ref: "Rating"   //name of the model
        }
    ]
   });

module.exports= mongoose.model("Campground",campgroundSchema);