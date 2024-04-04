require('dotenv').config();

const compression = require('compression');
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init middleware
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//init db
require('./dbs/init.mongodb')
// const { checkoverload } = require("./helpers/check.connect");
// checkoverload();
//init routes
app.use('/', require('./routes'))
//handling errors


module.exports=app;