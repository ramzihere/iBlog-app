var express = require("express");
var router = express.Router();
var Post = require("../models/blog");
var Comment  = require("../models/comment");
var middleware = require("../middleware");

router.get("/blogs/:id/comments", middleware.isLogedIn, function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/show", {post: foundPost}); 
        }
    });
});

router.get("/blogs/:id/comments/new", middleware.isLogedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {post: foundPost});     
        }
    });
});

router.post("/blogs/:id/comments", middleware.isLogedIn, function(req, res){
    Comment.create(req.body.comment, function(err, comment){
        if (err) {
            console.log(err);
        } else {
            Post.findById(req.params.id, function(err, foundPost){
                if (err) {
                    console.log(err);
                } else {
                    comment.user.id = req.user._id;
                    comment.user.username = req.user.username;
                    comment.save();
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect("/blogs/" + req.params.id);
                }
            });
        }
    });
});

router.get("/blogs/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("comments/edit", {comment: foundComment, post_id: req.params.id}); 
        }
    });
});

router.put("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

router.delete("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;