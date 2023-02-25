require('dotenv').config();
const chalk = require("chalk");


const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log(chalk.green.inverse.bold("mongoose database is connected successfully"));
}).catch((err)=>{
    console.log(err);
})
