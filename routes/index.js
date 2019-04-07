var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var expressJwt = require('express-jwt');
var User = require("../models/user");

router.get("/",(req,res)=>{   //route to landing page
    res.render("landing");
});


//Auth routes

//show the register form
router.get("/register",(req,res)=>{
    res.render("register");
})

//handling registration
router.post("/register",(req,res)=>{
    console.log("hi from register backend");
   //console.log(req.body);
    var salt= bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password,salt);

    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash
    });
    console.log(newUser);
    newUser.save().then(function(user){
        
        // var token = jwt.sign({userID:user.id, username:user.username},'My dog is the cutest',{expiresIn:'2h'});
        // res.send({token});
        console.log(res);
        return res.status(201).end();

    }).catch(function(err){
       //console.log(err);
        return res.status(202).json({message:'Error registering user'});
    })
  
    // newUser.save(function(err){
    //     if(err){
    //         console.log(err);
    //         return res.render("register");
    //     }else{
    //         User.findOne({email:req.body.email}, function(err,user){
       
    //             if(!user){
    //                 console.log("login failed 1");
    //                 res.render("login",{error: "incorrect email/password"});
    //             }else{
    //                 if(bcrypt.compareSync(req.body.password , user.password)){
    //                     req.session.user = user;  //user info stored in session
    //                     console.log( req.session.user);
    //                     res.redirect("/campgrounds");
    //                 }else{
    //                     console.log("login failed 2");
    //                     res.render("login", {error: "Incorrect password"});
    //                 }
    //             }
    //         });
    //     }

    // }) 
});
//get/logout
router.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/campgrounds");
    //return res.status(200).send();
})

//show the login form
router.get("/login",(req,res)=>{
    res.render("login");
});

//handling login
//app.("/login",middleware,callback function)
router.post('/login',(req,res)=>{
    console.log(req.body.email);
    User.findOne({email:req.body.email}).then(function(user){
       
        if(!user){
            console.log("No User Found");
            return res.json({});
            // res.render("login",{error: "incorrect email/password"});
        }else{
            if(bcrypt.compareSync(req.body.password , user.password)){
                var token = jwt.sign({userID:user.id, username:user.username},'My dog is the cutest',{expiresIn:'2h'});
                res.send({token});
                // req.session.user = user;  //user info stored in session
                // console.log( req.session.user);
                // res.redirect("/campgrounds");
            }else{
                console.log("login failed 2");
                return res.json({});
                // res.render("login", {error: "Incorrect password"});
            }
        }
    });
    
});
//FORCE Authentication
// function requireLogin(req,res,next){
//     //if user is not login then redirect to login page
//     if(!req.session.user){
//         res.redirect("/login");
//     }else{
//         console.log(req.session.user.username);
//        return next();
       
//     }
// };
module.exports = router;