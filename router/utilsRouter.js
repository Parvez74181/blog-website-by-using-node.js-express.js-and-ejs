const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/model/user");
const Post = require("../database/model/post");
const userAuth = require('../middelware/userAuthentication');
const upload = require("../middelware/multer");
const errorFormatter = require('../utils/validatorErrorFormatter');
const { body, validationResult } = require('express-validator');
const Profile = require("../database/model/profile");
const chalk = require("chalk");


// post delete
route.get('/:authoreId/delete/:postId', userAuth, async (req, res, next) => {
    try {
        let { postId } = req.params;
        await Post.findByIdAndDelete(postId);

        // to get the token everytime and check that is this the new generated token? 
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);
        if (verify) {

            res.status(204).redirect('/user/dashboard');
        } else {

            res.status(400).redirect('/user/sign-in');
        }
    } catch (error) {
        console.log(error);
    };
})

// post edit
route.get('/edit/:postId', userAuth, async (req, res, next) => {

    let { postId } = req.params;
    console.log(postId);
    let post = await Post.findById(postId);
    // to get the token everytime and check that is this the new generated token? 
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

    const user = await User.findOne({ _id: verify._id });
    try {

        res.status(200).render('upload-page', {
            verify,
            user,
            post,
            title: post.title,
            description: post.description,
            success: 'Post Successfully Uploaded',
            unsuccess: ''
        });
    } catch (error) {
        res.status(400).redirect('/user/dashboard')
    };
});

// route.get('*', (req,res,next)=>{
// res.status(404).send('404 page not found')
// })


console.log(chalk.green.inverse.bold('utils router is connected'));

module.exports = route;