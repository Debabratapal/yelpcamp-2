var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
flash       = require("connect-flash"),
passport    = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride = require("method-override"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
User        = require("./models/user"),
seedDB      = require("./seed");


var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/auth");


mongoose.connect("mongodb://localhost/yelpcamp_v12");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT configuration

app.use(require("express-session")({
      secret: "jackof all trades",
      resave: false,
      saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
	next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);



app.listen(3000, "localhost", function(){
    console.log("YelpCamp app is listening..");
});
