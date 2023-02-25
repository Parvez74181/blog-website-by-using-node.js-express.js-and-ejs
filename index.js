// require('dotenv').config();
const express = require('express');
const router = require("../Futurisers - Learn Sparkly/router/router");
const userRouter = require('../Futurisers - Learn Sparkly/router/userRouter');
const adminRouter = require('../Futurisers - Learn Sparkly/router/adminRouter');
const updateRouter = require('../Futurisers - Learn Sparkly/router/updateRouter');
const apiRouter = require('../Futurisers - Learn Sparkly/router/apiRouter');
const utilsRouter = require('../Futurisers - Learn Sparkly/router/utilsRouter');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const chalk = require("chalk");
require("../Futurisers - Learn Sparkly/database/mongoConnection/mongoose");

const app = express();
const port = 8000;

//EXPRESS RELATED STUFF
app.use('/static', express.static('static')); // for saving static files
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
})); // for encoding the form data

app.use(bodyParser.json({ limit: '50mb' }));

app.use(cookieParser());


app.set('view engine', 'ejs');// set the template engine as ejs
app.set('views', path.join(__dirname, 'views')); // set the views directory

//use espress router
app.use(router);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/update', updateRouter);
app.use('/api', apiRouter);
app.use('/utils', utilsRouter);



//START THE SERVER
app.listen(port, () => {
    console.log(chalk.green.inverse.bold(`server is started successfully on port: ${port}`));
}) 