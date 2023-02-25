const { Schema, model } = require('mongoose');
const Post = require('./post');
const chalk = require("chalk");


const categorySchema = new Schema({
    category: {
        type: String,
        required: true
    },
    post: {
        type:Schema.Types.ObjectId,
        ref: 'Post'
    }
},{timestamps:true});



console.log(chalk.green.inverse.bold('category schema is connected'));

module.exports = Category = new model('category', categorySchema);