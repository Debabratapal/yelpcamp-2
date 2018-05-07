var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX- show all campgrounds
router.get("/campground", function(req, res){

      //find all campground
      Campground.find({}, function(err, campgrounds){
            if(err){
                  console.log(err);
            }else {
                  res.render("campgrounds/index" , {campground : campgrounds, currentUser: req.user});
            }
      })

});


//CREATE- add a new campgoud to db
router.post("/campground", middleware.isLogIn, function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var price = req.body.price;
   var author= {
         id : req.user._id,
         username: req.user.username
   }
   var newCampground = {name: name, image: image, description: description, author: author, price : price };
      console.log(req.user);
      //create a new campground
      Campground.create(newCampground, function(err, campground){
            if(err){
                  console.log(err);
            } else {
                  console.log(campground);
                  //redirect to all campground
                   res.redirect("/campground");
            }
      });


});


//NEW-
router.get("/campground/new", middleware.isLogIn, function(req, res){
    res.render("campgrounds/new");
});


//SHOW-show the details about the campground
router.get("/campground/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
             console.log(err);
       } else {
             res.render("campgrounds/show", {campground : foundCampground});

       }
   });
});
//edit campground
router.get("/campground/:id/edit", middleware.checkParmission, function(req, res){
      Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                  res.redirect("back");
            }
           res.render("campgrounds/edit", {campground : foundCampground});
      });
});
//Update campground
router.put("/campground/:id", middleware.checkParmission, function(req, res){

   Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, newly){
      if(err){
           console.log(err);
      }else {
           res.redirect("/campground/"+req.params.id);
      }
   });
});

//destroy campground
router.delete("/campground/:id", middleware.checkParmission, function(req, res){
      Campground.findByIdAndRemove(req.params.id, function(err){
            if(err){
                 res.redirect("/campground/"+req.params.id);
            }else {
                  res.redirect("/campground");
            }
      });
});

module.exports = router;

