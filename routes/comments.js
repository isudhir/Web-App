var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//New
router.get("/campgrounds/:id/comments/new",isloggedin,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err || !campground){
            req.flash("error",err.message);
            console.log(err);
        } else {
           res.render("comments/new.ejs",{campground:campground}); 
        }
    });
});


//Create
router.post("/campgrounds/:id/comments",isloggedin,function(req,res){
   Campground.findById(req.params.id,function(err,campground){
       if(err || !campground){
           req.flash("error",err.message);
           console.log(err);
       } else {
           Comment.create(req.body.comment,function(err,comment){
              if(err){
                  req.flash("error",err.message);
                  console.log(err);
              } else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  campground.comments.push(comment._id);
                  campground.save();
                  req.flash("success","Comment Added");
                  res.redirect("/campgrounds/"+ req.params.id);
              }
           });
       }
   });
});

//Edit
router.get("/campgrounds/:id/comments/:comment_id/edit",ownership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundcomment) {
        if(err || !foundcomment){
            req.flash("error","Comment not found")
        } else {
            res.render("comments/edit.ejs",{campground:req.params.id,comment:foundcomment}); 
        }
    })    
});

//Update
router.put("/campgrounds/:id/comments/:comment_id",ownership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedcomment){
       if(err || !updatedcomment){
           req.flash("error",err.message)
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

//Delete
router.delete("/campgrounds/:id/comments/:comment_id",ownership,function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) 
});


//middleware
function isloggedin(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error","You Need To Log-In To Do That")
  res.redirect("/login")
};

function ownership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err){
                 req.flash("error","Comment not found")
                res.redirect("back");
            } else {
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You Don't Have Permission To Do That!!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You Need To Log-In To Do That")
        res.redirect("back");
    }
}

module.exports = router;