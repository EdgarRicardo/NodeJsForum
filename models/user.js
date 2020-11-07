'use strict'


//Creating user model
const mongoose = require('mongoose');
var model = mongoose.Schema;

var userSchema = model({
    name: String,
    surname: String,
    email: String,
    password: String,
    avatar: {type: String, default: null},
    role: {type: String, default: 'normal'}
});


module.exports = mongoose.model('User', userSchema);