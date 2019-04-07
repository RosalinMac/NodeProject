var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Rating = require('../models/ratings')
var middleware = require("../middleware"); //import middleware
var multer= require('multer');
//*************************** */
//Index route//campground//
//*************************** */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});
var upload = multer({dest:'./public/images',storage: storage});
router.get("/campgrounds",(req,res)=>{   // show all of the campgrounds
    
    //get all campgrounds from db
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("err");
        }else{
           res.json(allCampgrounds);
//res.render("campgrounds/index",{campgrounds: allCampgrounds});//index is in campground dir

        } /// while rendering pass the logged in user info 
    });
    //res.render("campgrounds",{campgrounds: campgrounds});
});

//NEW route-this route should be declared before show route
// router.get("/campground/new",middleware.requireLogin,(req,res)=>{  //route to show the form tht sends data to post route when submitting new campground
//     res.render("campgrounds/new"); //render a form
// });

//SHOW route -show info about one campground
router.get("/campgrounds/:id", function(req,res){
    //find the campground with provided Id
    // console.log(req.params.id);
    Campground.findById(req.params.id).populate(["ratings","comments"]).exec(function(err,foundCampground){
            if(err){
                console.log(err);
            }else{
                 console.log(foundCampground);
                //render to show route with that campground
                // res.render("campgrounds/show",{campground : foundCampground});
                res.json(foundCampground);
            }
    });
   
});

router.post("/campgrounds",middleware.checkAuthorization,upload.single('Ifile'),(req,res)=>{  //create a new campground

    console.log(req.body.campground)    
    var name=req.body.campground//get data from form and add to campground array
    var image= 'http://localhost:8080/images/'+ req.file.originalname
    var desc=req.body.desc; 
 //var price=req.body.price;
     var author = {
         id: req.userData.userID,
         username: req.userData.username
     };
    var newCampGround = {name:name ,image: image, description: desc, author: author};
   // campgrounds.push(newCampGround);
   //console.log(newCampGround);
   Campground.create(newCampGround,function(err,newlyCreated){
       if(err){
        console.log(err);
       }else{
           console.log(newlyCreated);
       // res.redirect("/campgrounds");//redirect back to campgrounds page
       res.json(newlyCreated);
       }
   });//create a new campground and save in the db
    
});

//edit campground
router.get("/campgrounds/:id/edit",middleware.checkAuthorization,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
            console.log(foundCampground);
            res.json(foundCampground);
    })
});
//update campground
router.put("/campgrounds/:id",middleware.checkAuthorization,upload.single('Ifile'),function(req,res){
    //find and update the correct campground
    console.log(req.body);
    var name=req.body.campground//get data from form and add to campground array
    var image= 'http://localhost:8080/images/'+ req.file.originalname
    var desc=req.body.desc; 
    var updated= {name:name ,image: image, description: desc};
    Campground.findByIdAndUpdate(req.params.id,updated,function(err,updatedcampground){
        if(err){
          console.log(err);
        }else{
            res.json(updatedcampground);//redirect to show page
        }
    });
});
//deleting campground
router.delete("/campgrounds/:id",function(req,res){
    console.log(req.params.id);
  Campground.findByIdAndDelete(req.params.id,function(err,campgroundRemoved){
      if(err){
          res.redirect("/campgrounds");
      }else{
          Comment.deleteMany({_id: {$in: campgroundRemoved.comments}},
            (err)=>{
                if(err){
                    console.log(err);
                }
               //res.sendStatus(204);
               res.sendStatus(204);
            });
        
      }
  })
});

module.exports = router;