'use strict'


//
const mongoose = require('mongoose');
var model = mongoose.Schema;

 var commentSchema= model({
    content: String,
    date: {type: Date, default: Date.now},
    user: {type: model.ObjectId, ref: 'User'}
});

var comment = mongoose.model('Comment', commentSchema);

var  topicSchema = model({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, default: Date.now},
    user: {type: model.ObjectId, ref: 'User'},
    comments: [commentSchema],
});

//Creating topic model
module.exports = mongoose.model('Topic', topicSchema);