const multer = require("multer")
const path = require('path')
const chalk = require("chalk");

// set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/img/uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});


console.log(chalk.green.inverse.bold("multer successfully connected"));
module.exports = upload = multer({ storage });

