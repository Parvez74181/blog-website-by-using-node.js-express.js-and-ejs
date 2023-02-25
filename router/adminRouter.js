const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/model/user");
const Post = require("../database/model/post");
const userAuth = require('../middelware/userAuthentication');
const Profile = require("../database/model/profile");
const chalk = require("chalk");




// user-dashboard page
route.get('/dashboard', userAuth, async (req, res) => {
    try {
        let currentPage = parseInt(req.query.page) || 1;
        let itemPerPage = 6; // how many post i wanted to show

        // find the posts from the database and sort them to show the new post first 
        let posts = await Post.find({ authore: req.user._id })
            .sort({ _id: -1 }) //sorting the post from new to old
            .skip((itemPerPage * currentPage) - itemPerPage)  // skip the given values like this=> ((10*1)-1 =0)
            .limit(itemPerPage) // showing limited post
            .populate('authore')
            .setOptions({ allowDiskUse: true }).exec()
        // total page
        let totalPost = await Post.countDocuments();
        let totalPage = Math.ceil(totalPost / itemPerPage);

        // to get the token everytime and check that is this the new generated token? 
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

        const user = await User.findOne({ _id: verify._id });

        let bookmarks = [];
        let profile = await Profile.findOne({ user })
            .setOptions({ allowDiskUse: true }).exec()

        if (profile) {
            bookmarks = profile.bookmarks
        }
        res.status(200).render('adminDashboard', {
            verify,
            user,
            posts,
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks,
            title: 'Dashboard | Unidef.com'
        });
    } catch (error) {
        res.status(400).render('sign-in')
        console.log(error);
    };

});



console.log(chalk.green.inverse.bold('admin router is connected'));
module.exports = route;