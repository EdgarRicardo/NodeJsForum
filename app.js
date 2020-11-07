'use strict'

// Required Dependencies
const express = require('express');
const bodyParser = require('body-parser');

//Excute Express
const app = express();

//Route charge
const userRoutes = require('./routes/user');
const topicRoutes = require('./routes/topic');
const commentRoutes = require('./routes/comment');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // Request -> JSON

//CORS


// Rewrite routes
app.use('', userRoutes);
app.use('', topicRoutes);
app.use('', commentRoutes);

//Export module
module.exports = app;

