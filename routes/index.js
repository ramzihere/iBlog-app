var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", middleware.checkUserState, function(req, res){
    res.render("landing");
});

router.get("/register", middleware.checkUserState, function(req, res){
    res.render("users/register");
});

router.post("/register", middleware.checkUserState, function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("users/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/blogs");
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res){

});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

module.exports = router;