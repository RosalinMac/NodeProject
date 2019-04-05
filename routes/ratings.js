var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Rating = require('../models/ratings'),
    middleware= require('../middleware');

    // find rating from campground id

    router.post('/campgrounds/:id/ratings',middleware.checkAuthorization,function(req,res){
        console.log(req.body);
        Campground.findById(req.params.id, function(err, campground){
         
            if(err){
                console.log(err);
            }
            if(req.body.rating){
                console.log(req.body.rating);
                var author = {
                    id: req.userData.userID,
                    username: req.userData.username
                }

                var rating={
                    rating: req.body.rating,
                    author: author,
                };
                console.log(rating);
                Rating.create(rating,function(err,userRating){
                    console.log('from rating create ')
                    console.log(userRating);
                    if(err){
                        console.log(err);
                    }else{
                        userRating.author =  author;
                      
                        userRating.save();
                        campground.ratings.push(userRating);
                        campground.save();
                        res.json(campground);
                    }

                })
            }else{
                console.log("please select rating");
                res.json(campground);
            }
        })
    });
    module.exports = router;