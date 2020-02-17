var express = require("express");
var router = express.Router();
var Post = require("../models/blog");
var middleware = require("../middleware");

router.get("/blogs", middleware.isLogedIn, function(req, res){
    Post.find({}).populate("comments").exec(function(err, posts){
        if (err) {
            console.log(err);
        } else {
            res.render("blogs/index", {posts: posts});     
        }
    });
});

router.get("/blogs/new", middleware.isLogedIn, function(req, res){
    res.render("blogs/new");
});

router.post("/blogs", middleware.isLogedIn, function(req, res){  
    Post.create(req.body.post, function(err, createdPost){
        if (err) {
            console.log(err);
        } else {
            createdPost.user.id = req.user._id;
            createdPost.user.username = req.user.username;
            createdPost.save();
            res.redirect("/blogs");
        }
    });
});

router.get("/blogs/:id", middleware.isLogedIn, function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
            res.render("blogs/show", {post: foundPost});         
        }
    });
});

router.get("/blogs/:id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        res.render("blogs/edit", {post: foundPost});
    });
});

router.put("/blogs/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

router.delete("/blogs/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

module.exports = router;