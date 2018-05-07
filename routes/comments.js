var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//=================
// Comment Route
//=================

router.get("/campground/:id/comments/new", middleware.isLogIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){

            console.log(err);
      }else{
         res.render("comments/new", {campground : campground});
      }
   });

});

router.post("/campground/:id/comments", middleware.isLogIn, function(req, res){
      //lookup campground by id
      Campground.findById(req.params.id, function(err, campground){
         if(err){
               console.log(err);
               res.redirect("/campground");
         } else {
               //create a new comment
               Comment.create(req.body.comment, function(err, comment){
                 if(err){
                       req.flash("error", "Something went wrong! Please Try Again!");
                      console.log(err);
                 }else {
                       //console.log("new comment's auther will be "+ req.user.username);
                       comment.author.id = req.user._id;
                       comment.author.username = req.user.username;
                       comment.save();
                        req.flash("success", "Successfully added a comment!");
                       //connect new comment to campground
                        campground.comments.push(comment);
                        campground.save();
                        console.log(comment);
                        //redirect to the show page
                        res.redirect("/campground/"+campground._id);
                 }
            });
         }
      });
});

//Edit form
router.get("/campground/:id/comments/:comment_id/edit", middleware.checkCommentParmission, function(req, res){
      Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err){
               console.log(err);
               res.redirect("back");
         } else {
               res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
         }
      });
});

//Update form
router.put("/campground/:id/comments/:comment_id", middleware.checkCommentParmission, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
         if(err){
               console.log(err);
         }else{
               res.redirect("/campground/"+req.params.id);
         }
   })
});
//Destroy the comment
router.delete("/campground/:id/comments/:comment_id", middleware.checkCommentParmission, function(req, res){
      Comment.findByIdAndRemove(req.params.comment_id, function(err){
            if(err){
                  res.redirect("/campground/"+req.params.id);
            } else {
                  req.flash("success", "The Comment has Successfully deleted!");
                  res.redirect("/campground/"+req.params.id);
            }
      });
});

module.exports = router;