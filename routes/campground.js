var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//index
router.get("/campgrounds",function(req,res){
   // Getting data from database
   Campground.find({},function(err,allcamps){
       if(err){
           console.log(err);
       } else {
           res.render("campground/index",{campgrounds:allcamps});
       }
   }); 
});


//New
router.get("/campgrounds/new",isloggedin,function(req,res){
   res.render("campground/new.ejs"); 
});



//Create
router.post("/campgrounds",isloggedin,function(req,res){
    //getting data out of form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    };
    var newcampground = {name:name , image:image , description:desc,author:author};
    Campground.create(newcampground,function(err,newly){
        if(err){
            req.flash("error",err.message)
            console.log(err);
        } else {
            req.flash("success","Campground Created")
            res.redirect("/campgrounds");
        }
    });
});


//Show
router.get("/campgrounds/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err,find){
      if(err || !find){
          req.flash("error", "Something Went Wrong");
          console.log(err);
      } else {
          console.log(find);
          res.render("campground/show.ejs",{camp:find});
      }
   });
});

//Edit 
router.get("/campgrounds/:id/edit",ownership,function(req,res){
    Campground.findById(req.params.id,function(err,found){
        if(err || !found){
            res.redirect("/campground");
        } else {
           res.render("campground/edit.ejs",{campground:found}); 
        }
    }); 
});

//Update
router.put("/campgrounds/:id",ownership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,foundcampground){
        if(err || !foundcampground){
            console.log(err);
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Delete
router.delete("/campgrounds/:id",ownership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   }) 
});

//middleware
function isloggedin(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error","You Need To Logged In To Do That");
  res.redirect("/login");
}

function ownership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundcampground){
            if(err || !foundcampground){
                req.flash("error","Campground not found")
                res.redirect("back");
            } else {
                if(foundcampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You Don't Have Permission To Do That!!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You Need To Log-in To Do That!!")
        res.redirect("/login");
    }
}

module.exports = router;