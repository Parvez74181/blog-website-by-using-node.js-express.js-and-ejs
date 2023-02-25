const { Schema, model } = require('mongoose');
const Post = require('./post');
const User = require('./user');
const chalk = require("chalk");


const commentSchema = new Schema({
    // comments
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    // replies
    replies: [{
        body: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        profilePic: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
    }]
}, { timestamps: true });



console.log(chalk.green.inverse.bold('comment schema is connected'));

module.exports = Comment = new model('comment', commentSchema);