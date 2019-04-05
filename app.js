var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose= require("mongoose");
var session = require('client-sessions'); //middelware

//var seedDB = require("./seeds")



var commentRoutes = require("./routes/comments"),
    campgroundRouter = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    ratingRoutes = require("./routes/ratings")

mongoose.connect("mongodb://127.0.0.1:27017/local");
//seedDB(); seed the databse
app.use(bodyParser.json());
//  app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods","POST, GET, UPDATE, DELETE, PUT");
    next();
  });
app.use(session({         //middleware use
    cookieName: 'session',
    secret: 'My dog simba is the cutest!',
    duration: 30 * 60 * 1000, 
    activeDuration: 5 * 60 * 1000,
    httponly: true,
    secure:true,
    emphemeral: true,


}));
//SMART USER MIDDLEWARE
app.use(function(req,res,next){
res.locals.currentUser = req.session.user;
next();             
});

app.use(indexRoutes);
app.use(commentRoutes); 
app.use(campgroundRouter);
app.use(ratingRoutes);

app.listen(8080,(req,res)=>{  //starting the server
    console.log("YelpCamp server has started...");
});