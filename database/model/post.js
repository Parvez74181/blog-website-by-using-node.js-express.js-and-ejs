const { Schema, model } = require("mongoose");
const User = require('./user');
const Comment = require('./comment');
const chalk = require("chalk");

const postSchema = new Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true
    },
    authore: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String]
    },
    categories: {
        type: [String]
    },
    thumbnail: {
        type: String,
        required: true
    },
    likes: [Schema.Types.ObjectId],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    views: Number,
    siNo: Number,
    date: String,
    time: String

}, { timestamps: true });


console.log(chalk.green.inverse.bold('post schema is connected'));

module.exports = Post = new model("post", postSchema);