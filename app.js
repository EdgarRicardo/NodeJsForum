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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rewrite routes
app.use('', userRoutes);
app.use('', topicRoutes);
app.use('', commentRoutes);

//Export module
module.exports = app;

