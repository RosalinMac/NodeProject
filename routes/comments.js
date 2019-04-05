var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //import middleware

// ************************************
//COMMENT ROUTES
//**************************************

router.get("/campgrounds/:id/comments/new", function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{

           // res.render("comments/new",{campground: campground})
           res.json(campground);        
        }
    })
       
});

router.post("/campgrounds/:id/comments",middleware.checkAuthorization , function(req,res){
   //lookup campground using id
   console.log('hi from comment');
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
          // res.redirect("/campgrounds");
       }else{
              //create new comment
        console.log(req.body);
          Comment.create(req.body,function(err,comment){
               if(err){
                   console.log(err);
               }else{
                   //add username and id to comment
                  // console.log(req.session.user._id,req.session.user.username)
                comment.author.id =  req.userData.userID
                comment.author.username = req.userData.username
                comment.date = new Date();
                // save comment
               comment.save();
               //connect new comment to campground
               campground.comments.push(comment);
               campground.save();
               res.json(campground);
               //res.redirect("/campgrounds/"+ campground._id);
               }
          });
       }
   });
   //redirect to campground show page 
});

//edit comment
router.get("/campgrounds/:id/comments/:comment_id/edit",function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else {
            res.render("comments/edit",{campground_id: req.params.id, comment:foundComment});

        }
    })
})

//update comment
router.put("/campgrounds/:id/comments/:comment_id",function(req,res){
 
    Comment.findByIdAndUpdate(req.params.comment_id,req.body,function(err,UpdatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.json(UpdatedComment);
        }
    });
})

//delete comment
router.delete("/campgrounds/:id/comments/:comment_id",function(req,res){

   Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
           res.json("back");
       }else{   
           Campground.updateOne({_id: req.params.id},{$pull:{comments: req.params.comment_id}},function(err){
               console.log(err);
           })
            res.sendStatus(204);
       }
   });
});

module.exports = router;
