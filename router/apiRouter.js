const express = require("express");
const route = express.Router();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const User = require("../database/model/user");
const Post = require("../database/model/post");
const Comment = require("../database/model/comment");
const Profile = require("../database/model/profile");
const userAuth = require('../middelware/userAuthentication');
const errorFormatter = require('../utils/validatorErrorFormatter');
const { body, validationResult } = require('express-validator');
const upload = require("../middelware/multer");
const chalk = require("chalk");



// comment post controller
route.post('/comments/:postId', userAuth, async (req, res, next) => {
    let { postId } = req.params;
    let { body } = req.body;


    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user'
        })
    } else {
        let comment = new Comment({
            post: postId,
            user: req.user._id,
            body,
            replies: []
        });
        try {
            let createdComment = await comment.save();
            await Post.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    $push: {
                        'comments': createdComment._id
                    }
                }
            );


            let commentJSON = await Comment.findById(createdComment._id).populate('user');
            return res.status(201).json(commentJSON)
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: `Server Error Occured`
            })
        }
    }



});


// replies post controller
route.post('/comments/replies/:commentId', userAuth, async (req, res, next) => {
    let { commentId } = req.params;
    let { body } = req.body;
    let reply = {
        body,
        profilePic: req.user.profilePic,
        userName: req.user.userName,
        user: req.user._id,
    };

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user'
        })
    }

    try {
        await Comment.findByIdAndUpdate(
            {
                _id: commentId
            },
            {
                $push: {
                    'replies': reply
                }
            }
        );


        res.status(201).json({
            ...reply

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Server Ettor Occured`
        })

    }
});

// likes
route.get('/likes/:postId', userAuth, async (req, res, next) => {
    let { postId } = req.params;
    let liked = null;

    let userId = req.user._id;

    try {
        let post = await Post.findOne({ _id: postId });

        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    $pull: {
                        'likes': userId
                    }
                }
            )
            liked = false
        }

        else {
            await Post.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    $push: {
                        'likes': userId
                    }
                }
            )
            liked = true;
        }
        let updatedPost = await Post.findById(postId);
        res.status(200).json({
            liked,
            totalLikes: updatedPost.likes.length
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Server Error Occured`
        });
    }

});


// bookmarks
route.get('/bookmarks/:postId', userAuth, async (req, res, next) => {
    let { postId } = req.params;
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user'
        })
    };

    let userId = req.user._id;
    let bookmark = null
    try {
        let profile = await Profile.findOne({ user: req.user._id });

        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                {
                    user: userId
                },
                {
                    $pull: {
                        'bookmarks': postId
                    }
                }
            )
            bookmark = false
        } else {
            await Profile.findOneAndUpdate(
                {
                    user: userId
                },
                {
                    $push: {
                        'bookmarks': postId
                    }
                }
            )
            bookmark = true
        }


        return res.status(200).json({
            bookmark
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Server Ettor Occured`
        })
    }
})


// image upload
route.post('/imageUpload', userAuth, upload.single('image'), async (req, res, next) => {
    const { filename: image } = req.file;

    // resize an image 
    try {
        await sharp(req.file.path)
            .resize(400)
            .jpeg({ quality: 90 })
            .toFile(
                path.resolve('static/img/uploads/resized', image)
            )

        // unlink the main file after resised the image
        fs.unlinkSync(`static/img/uploads/${req.file.filename}`);



        return res.status(200).json({
            'image_uri': `../static/img/uploads/resized/${req.file.filename}`
        })
    }
    catch (error) {
        console.log(error);
    };

})


console.log(chalk.green('api router is connected'));

module.exports = route;