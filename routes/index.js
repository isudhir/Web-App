var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/",function(req,res){
   res.render("landing"); 
});


//==========Authentication section

//===Sign up 
//show form
router.get("/register",function(req,res){
   res.render("register.ejs"); 
});

//sign up logic
router.post("/register",function(req,res){
   User.register(new User({username:req.body.username}),req.body.password,function(err,user){
       if(err){
           req.flash("error",err.message)
           res.redirect("/register");
       }
       passport.authenticate("local")(req,res,function(){
           req.flash("success","Welcome Here" + user.username)
          res.redirect("/campgrounds"); 
       });
   }); 
});

//==login
//show login form
router.get("/login",function(req,res){
   res.render("login.ejs"); 
});

//log in logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(err){
    if(err){
        console.log(err)
    }
});

//==log out
router.get("/logout",function(req,res){
   req.logout();
   req.flash("error","Logged You Out!!!")
   res.redirect("/campgrounds")
});

function isloggedin(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login")
};


module.exports = router;
