'use strict';
const validator = require('validator'); 
const   Topic = require('../models/topic');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

var controller = {
    test: function(request, res){
        return res.status(200).send({
            message: "Works!!!"
        });
    },

    new: function(request,res){
        const info = request.body;
        const userInfo = request.userInfo;

        var title = !validator.isEmpty(info.title.trim());
        var content = !validator.isEmpty(info.content.trim());
        var code =  !validator.isEmpty(info.code.trim());
        var lang = !validator.isEmpty(info.lang.trim());

        info.comments = undefined; // no comments at start

        if(title && content){
            if((code && !lang) || (!code && lang)){ 
                return res.status(400).send({
                    status: 'Error',
                    message: "Fill up code and language"
                });
            }
            info.user = userInfo.sub;
            var topic = new Topic(info);
            topic.save((err, topicSaved)=>{
                if(err || !topicSaved){
                    return res.status(500).send({
                        status: 'Error',
                        message: "Problem saving topic"
                    });
                }
                return res.status(200).send({
                    status: 'Success',
                    message: "Topic saved",
                    topic: topicSaved
                });
            });
        }else{
            return res.status(400).send({
                status: 'Error',
                message: "Fill up title and content"
            });
        }
    },

    update: function(request,res){
        const info = request.body;
        const userInfo = request.userInfo;
        const id = request.params.id;

        var title = !validator.isEmpty(info.title.trim());
        var content = !validator.isEmpty(info.content.trim());
        var code =  !validator.isEmpty(info.code.trim());
        var lang = !validator.isEmpty(info.lang.trim());

        if(title && content){
            if((code && !lang) || (!code && lang)){ 
                return res.status(400).send({
                    status: 'Error',
                    message: "Fill up code and language"
                });
            }
            Topic.findOneAndUpdate({"_id": id,"user": userInfo.sub},info,{new:true},(err,topic)=>{
                if(err || !topic){
                    return res.status(400).send({
                        status: 'Error',
                        message: "Problem updating topic"
                    });
                }
                return res.status(200).send({
                    status: 'Success',
                    topic
                });
            });

        }else{
            return res.status(400).send({
                status: 'Error',
                message: "Fill up title and content"
            });
        }
    },

    delete: function(request,res){
        const id = request.params.id;
        const userInfo = request.userInfo;
        Topic.findOneAndDelete({"_id":id, "user": userInfo.sub},(err, topic)=>{
            if(err || !topic){
                return res.status(400).send({
                    status: 'Error',
                    message: "Problem deleting topic"
                });
            }
            return res.status(200).send({
                status: 'Success',
                topic
            });
        });
    },

    getTopics: function(request,res){
        Topic.find({},{"user.password":0,"user.role":0},(err, topics)=>{
            if(err || !topics){
                return res.status(400).send({
                    status: 'Error',
                    message: "There are not topics"
                });
            }
            return res.status(200).send({
                status: 'Success',
                topics
            });
        }).populate('user',{"password":0,"role":0})
        .populate('comments.user',{"name":1,"surname":1,"_id":0})
        .sort({date: -1});
    },

    getTopicByUser: function(request,res){
        const id = request.params.id;
        Topic.find({"user": id},(err, topics)=>{
            if(err || !topics){
                return res.status(400).send({
                    status: 'Error',
                    message: "There are not topics"
                });
            }
            return res.status(200).send({
                status: 'Success',
                topics
            });
        }).populate('user',{"password":0,"role":0})
            .populate('comments.user',{"name":1,"surname":1,"_id":0})    
            .sort({date: -1});
    },

    getTopic: function(request,res){
        const id = request.params.id;
        Topic.findById(id,(err, topic)=>{
            if(err || !topic){
                return res.status(400).send({
                    status: 'Error',
                    message: "There is not topic"
                });
            }
            return res.status(200).send({
                status: 'Success',
                topic
            });
        }).populate('user',{"password":0,"role":0})
            .populate('comments.user',{"name":1,"surname":1,"_id":0})
            .sort({date: -1});
    }
};

module.exports = controller;