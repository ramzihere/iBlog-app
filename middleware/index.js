var Post = require("../models/blog");
var Comment = require("../models/comment");
var middlewareObj = {};

 //checkPostOwnership
middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            if (err) {
                console.log(err);
            } else {
                if(foundPost.user.id.equals(req.user._id)){
                next();     
            } else{
                res.redirect("back");
            }
        }
        });
    } else{
            res.redirect("back");
        }
}

//checkCommentOwnership
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                console.log(err);
            } else {
                if(foundComment.user.id.equals(req.user._id)){
                next();     
            } else{
                res.redirect("back");
            }
        }
        });
    } else{
            res.redirect("back");
        }
}

//Auth Middleware
middlewareObj.isLogedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/");
    }
}

//middleware checkUserState
middlewareObj.checkUserState = function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect("/blogs");
    } else{
        next();
    }
}

module.exports = middlewareObj;