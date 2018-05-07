//all middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkParmission = function(req, res, next){
    if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                  if(err){
                        req.flash("error", "Campground not Found!");
                        res.redirect("back");
                  }else {
                        if(foundCampground.author.id.equals(req.user._id)){
                              next();
                        } else {
                            req.flash("error", "You don't have permission todo that");
                             res.redirect("back");
                        }
                  }
            });
      } else {
            req.flash("error", "You need to be loged in to do that!")
            res.redirect("back");
      }
}

middlewareObj.checkCommentParmission = function(req, res, next){
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                  if(err){
                        res.redirect("back");
                  }else {
                        if(foundComment.author.id.equals(req.user._id)){
                              next();
                        } else {
                           req.flash("error", "You don't have parmission to do that!");
                             res.redirect("back");
                        }
                  }
            });
      } else {
             req.flash("error", "You need to be log in to do that");
            res.redirect("back");
      }
}

middlewareObj.isLogIn= function(req, res, next) {
      if(req.isAuthenticated()){
            return next();
      }
      req.flash("error", "You Need to be logged in to do that!");
      res.redirect("/login");
}

module.exports = middlewareObj;