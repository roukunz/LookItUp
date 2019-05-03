var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    localStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    Category = require("./models/category");


mongoose.connect("mongodb://localhost/lookitup", { useNewUrlParser: true });

var app = express();

//routes
var indexRoute = require("./route/index");
var categoryRoute = require("./route/category");
var postRoute = require("./route/post");

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "very secret key",
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(express.static(__dirname + "/public"));


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/l", categoryRoute);
app.use("/l/:id/post", postRoute);
app.use(indexRoute);

app.listen(3000, '0.0.0.0', function(){
    console.log("Server has started ....");
})