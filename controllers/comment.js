'use strict';
const validator = require('validator'); 
const Topic = require('../models/topic');
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
        const id = request.params.idTopic;
        const userInfo = request.userInfo;
        const info = request.body;

        var content = !validator.isEmpty(info.content.trim());

        if(content){
            info.user = userInfo.sub;
            var comment = {
                user : userInfo.sub,
                content : info.content 
            }
            Topic.findById(id,(err, topic)=>{
                if(err || !topic){
                    return res.status(500).send({
                        status: 'Error',
                        message: "Problem finding topic"
                    });
                }
                topic.comments.push(comment);
                topic.save((err)=>{
                    if(err){
                        return res.status(500).send({
                            status: 'Error',
                            message: "Problem publishing comment"
                        });
                    }
                    return res.status(200).send({
                        status: 'Success',
                        message: "Comment was published",
                        topic
                    });
                });
            }).populate('comments.user',{"name":1,"surname":1,"_id":0});
        }else{
            return res.status(400).send({
                status: 'Error',
                message: "Fill up content"
            });
        }
    },

    update: function(request,res){
        const info = request.body;
        const id = request.params.idComment;
        const userInfo = request.userInfo;

        var content = !validator.isEmpty(info.content.trim());


        if(content){
            Topic.findOne({"comments._id" : id},(err, topic)=>{
                if(err || !topic){
                    return res.status(500).send({
                        status: 'Error',
                        message: "Problem finding comment"
                    });
                }
                //Verify if the user is owner of the comment
                var commentToUpdate = topic.comments.id(id);  
                if(commentToUpdate.user != userInfo.sub){
                    return res.status(500).send({
                        status: 'Error',
                        message: "This is not your comment"
                    });
                }
                //update comment
                Topic.findOneAndUpdate({"comments._id" : id},
                {"$set" : {"comments.$.content": info.content}},
                {new:true},
                (err, topic)=>{
                    if(err || !topic){
                        return res.status(500).send({
                            status: 'Error',
                            message: "Problem finding comment"
                        });
                    }
                    return res.status(200).send({
                        status: 'Success',
                        message: "Comment was updated",
                        topic
                    });
                }).populate('comments.user',{"name":1,"surname":1,"_id":0});
            });

        }else{
            return res.status(400).send({
                status: 'Error',
                message: "Fill up content"
            });
        }
    },

    delete: function(request,res){
        const info = request.body;
        const id = request.params.idComment;
        const userInfo = request.userInfo;

        Topic.findOne({"comments._id" : id},(err, topic)=>{
            if(err || !topic){
                return res.status(500).send({
                    status: 'Error',
                    message: "Problem finding comment"
                });
            }
            //Verify if the user is owner of the comment
            var commentToDelete = topic.comments.id(id);
            console.log(commentToDelete.user+" "+userInfo.sub);
            if(commentToDelete.user != userInfo.sub){
                return res.status(500).send({
                    status: 'Error',
                    message: "This is not your comment"
                });
            }
            //Delete comment
            commentToDelete.remove();
            topic.save((err)=>{
                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message: "Problem deleting comment"
                    });
                }
                return res.status(200).send({
                    status: 'Success',
                    message: "Comment was deleted",
                    topic
                });
            });
        });
    },

    getComments: function(request,res){
        const id = request.params.idTopic;
        Topic.findById(id,{"comments":1,_id:0},(err, comments)=>{
            if(err || !comments){
                return res.status(400).send({
                    status: 'Error',
                    message: "There is not topic"
                });
            }
            return res.status(200).send({
                status: 'Success',
                comments : comments.comments
            });
        }).populate('comments.user',{"name":1,"surname":1,"_id":0});
    }
};

module.exports = controller;