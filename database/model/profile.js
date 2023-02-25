const { Schema, model } = require('mongoose');
const User = require('./user');
const Post = require('./post');
const chalk = require("chalk");


let profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        trim: true
    },
    profilePic: String,
    links: [{
        facebook: String,
        twitter: String,
        youtube: String,
        instagram: String,
        linkedin: String,
        website: String
    }],
    posts: [{
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true })

console.log(chalk.green.inverse.bold('profile schema is connected'));

module.exports = Profile = new model('profile', profileSchema);