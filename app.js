var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDb = require("./seeds");
var flash = require("connect-flash");
var passport = require("passport");
var localstrategy = require("passport-local");
var User = require("./models/user");
var Comment = require("./models/comment");
var methodoverride = require("method-override");
var Campground = require("./models/campground");

//requiring routes
var commentsRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campground");
var indexsRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });


//seedDb();

//===========Passport Config
app.use(require("express-session")({
    secret:"tujhe kya frk pdta h hahahahha!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for checking if user is logged in or not in all routes
app.use(function(req,res,next){
   res.locals.currentuser=req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(commentsRoutes);
app.use(campgroundRoutes);
app.use(indexsRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server Has Started"); 
});