//all the middleware goes here

var middlewareObj = {},
Campground= require("../models/campground");
Comment = require("../models/comment");
const jwt= require('jsonwebtoken');

middlewareObj.checkAuthorization = function(req,res,next){  // checking user log-in
    try{
        let token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,'My dog is the cutest');
        req.userData = decoded;
        next();
    }catch(err){
        console.log("authorization error");
        return res.status(400).json({
            message: "Aunthentication failed"
        });
    }
}

middlewareObj.checkCampgroundAuthorization = function(req,res,next){
    if(req.session.user){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.session.user._id)){
                    next();
                }else{
                res.redirect("back");

                }
            }
        });
    }else{
        res.redirect("back"); 
    }
};

// middlewareObj.checkCommentAuthorization = function(req,res,next){
//     if(req.session.user){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 if(foundComment.author.id.equals(req.session.user._id)){
//                     next();
//                 }else{
//                 res.redirect("back");

//                 }
//             }
//         });
//     }else{
//         res.redirect("back"); 
//     }
// };

middlewareObj.requireLogin =  function (req,res,next){
    //if user is not login then redirect to login page
    if(!req.session.user){
        res.redirect("/login");
    }else{
        console.log(req.session.user.username);
       return next();
       
    }
};
module.exports = middlewareObj;