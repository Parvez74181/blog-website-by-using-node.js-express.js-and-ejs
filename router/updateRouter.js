const express = require("express");
const route = express.Router();
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const User = require("../database/model/user");
const Profile = require("../database/model/profile");
const userAuth = require('../middelware/userAuthentication');
const errorFormatter = require('../utils/validatorErrorFormatter');
const upload = require("../middelware/multer");
const { body, validationResult } = require('express-validator');
const chalk = require("chalk");


// let profileValidator = [
//     // userName Check
//     body('userName')

//         .isLength({ min: 2, max: 15 }).withMessage('Username Must Be Between 2 to 15 Charecter')
//         .trim(),

//     // Phone Check
//     body('phone')
//         .isNumeric().withMessage('Please Provide a Valid Phone')
//         .isLength({ min: 10, max: 12 }).withMessage('Please Provide a Valid Phone')
//         .custom(async phone => {
//             const userPhone = await User.findOne({ phone });
//             if (userPhone) {
//                 return Promise.reject('Phone Is Already In Use');
//             }
//             return true;
//         }),
//     // Address Check 
//     body('address')

//         .trim(),

// ]

// update profile

route.post('/profile', userAuth, upload.single('profilePic'), async (req, res) => {

    const {
        userName,
        phone,
        address,
        bio,
        facebook,
        twitter,
        instagram,
        youtube,
        linkedin,
        website
    } = req.body;

    // to get the token everytime and check that is this the new generated token? 
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);
    const user = await User.findOne({ _id: verify._id });

    const isNotNew = await Profile.findOne({ user: req.user._id });

    let profilePic;
    if (req.file) {
        try {
            const { filename: image } = req.file;
            await sharp(req.file.path)
                .resize(100)
                .jpeg({ quality: 90 })
                .toFile(
                    path.resolve('static/img/uploads/resized', image)
                );

            // unlink the main file after resised the image
            fs.unlinkSync(`static/img/uploads/${req.file.filename}`);
            profilePic = `../static/img/uploads/resized/${req.file.filename}`;
        } catch (error) {
            console.log(error);
        };
    }
    /*
        if there is a profile then update the profile
        else create a new profile
    */
    if (isNotNew) {
        try {
            // save the profile
            await Profile.findOneAndUpdate(
                { user: req.user._id },
                {
                    $set: {
                        bio,
                        links: {
                            facebook,
                            twitter,
                            instagram,
                            youtube,
                            linkedin,
                            website
                        },
                    }
                }


            );


            await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $set: {
                        profilePic,
                        userName,
                        phone,
                        address
                    }
                }
            )


            res.status(200).redirect('/user/dashboard');
        } catch (error) {
            res.status(400).render('profile-edit', {
                user,
                error: '',
                value: '',
                verify,
                profile: ''
            });
            console.log(error);
        };
    } else {

        try {
            // save the profile
            const profile = new Profile({
                user: req.user._id,
                bio,
                links: {
                    facebook,
                    twitter,
                    instagram,
                    youtube,
                    linkedin,
                    website
                },
                posts: [],
                bookmarks: []

            });
            let createdProfile = await profile.save();

            await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $set: {
                        profile: createdProfile._id,
                        profilePic,
                        userName,
                        phone,
                        address
                    }
                }
            )


            res.status(200).redirect('/user/dashboard');
        } catch (error) {
            res.status(400).render('profile-edit', {
                user,
                error: '',
                value: '',
                verify,
                profile: ''
            })
            console.log(error);
        };
    }

})


console.log(chalk.green.inverse.bold('update router is connected'));

module.exports = route;