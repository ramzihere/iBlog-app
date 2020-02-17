var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var localStragey = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSession = require("express-session");
var app = express();
var PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE || "mongodb://ramzihere:ramzihere@cluster0-shard-00-00-gkulq.mongodb.net:27017,cluster0-shard-00-01-gkulq.mongodb.net:27017,cluster0-shard-00-02-gkulq.mongodb.net:27017/natours?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"

var Post = require("./models/blog");
var Comment = require("./models/comment");
var User = require("./models/user");

var indexRoutes = require("./routes/index");
var blogsRoutes = require("./routes/blogs");
var commentsRoutes = require("./routes/comments");

// mongoose.connect("mongodb://localhost/socialapp", {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// });

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() =>{
    console.log("DB connection successful!");
})

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(expressSession({
    secret: "am the coolest person in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStragey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    return next();
});

app.use(indexRoutes);
app.use(blogsRoutes);
app.use(commentsRoutes);


//Server starting
app.listen(PORT, function(){
    console.log("iBlog Server has been Started...");
});