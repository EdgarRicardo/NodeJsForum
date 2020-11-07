'use strict';
const validator = require('validator'); 
const   User = require('../models/user');
const   bcrypt = require('bcrypt');
const  jwt = require('../services/jwt');
const   fs = require('fs');
const  path = require('path');


var controller = {
    test: function(request, res){
        return res.status(200).send({
            message: "Works!!!"
        });
    },

    save: function(request, res){
        // Get params of request
        var info = request.body;
        info.email = info.email.toLowerCase();
        info.role = undefined; // Role must be modified by an admin

        //Validate data
        var nameVal = !validator.isEmpty(info.name),
            surnameVal = !validator.isEmpty(info.surname),
            emailVal = !validator.isEmpty(info.email) && validator.isEmail(info.email),
            passwordVal = !validator.isEmpty(info.password);
        if(nameVal && surnameVal && emailVal && passwordVal){
            // Create objet
            var user = new User(info);
            // User exits?
            User.findOne({email: user.email}, (err, userExists) =>{
                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message: "Problem with the user duplicity validation"
                    });
                }else if(!userExists){
                    // Password encryption
                    bcrypt.hash(info.password,10,(err,hash)=>{
                        user.password = hash;
                        console.log(user.password);
                        // Save user
                        user.save((err, userSaved)=>{
                            if(err || !userSaved){
                                return res.status(500).send({
                                    status: 'Error',
                                    message: "Problem saving user"
                                });
                            }
                            return res.status(200).send({
                                status: 'Success',
                                message: "User saved",
                                user: userSaved
                            });
                        });
                    });
                }else{
                    return res.status(400).send({
                        status: 'Error',
                        message: "User already exists"
                    });
                }
            })
        }else{
            return res.status(400).send({
                status: 'Error',
                message: "Problem saving user: Data validation incorrect"
            });
        }      
    },

    login(request, res){
        //Get data
        var info = request.body;
        info.email = info.email.toLowerCase();

        //Validate data
        var emailVal = !validator.isEmpty(info.email) && validator.isEmail(info.email),
            passwordVal = !validator.isEmpty(info.password);
        if(emailVal && passwordVal){
            User.findOne({email: info.email}, (err, userExists) =>{
                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message: "Problem trying to find the user"
                    });
                }else if(userExists){
                    // Check password
                    bcrypt.compare(info.password,userExists.password).then(function(result) {
                        if(result){
                            userExists.password = undefined;
                            // Genarate token
                            return res.status(200).send({
                                status: 'Success',
                                message: "User logged",
                                user: userExists,
                                token: jwt.createToken(userExists)
                            });
                        }else{
                            return res.status(400).send({
                                status: 'Error',
                                message: "Incorrect Password"
                            });
                        }
                    });
                }else{
                    return res.status(400).send({
                        status: 'Error',
                        message: "User doesn't exists"
                    });
                }

            });
        }else{
            return res.status(400).send({
                status: 'Error',
                message: "Check the data"
            });
        }
    },

    update: function(request, res){
        var info = request.body;
        var file = request.files;
        if(file.file0){
            var file_path = file.file0.path;
            if(!file.file0.type){ //Path without extension
                fs.unlink(file_path, (err)=>{});
            }else if(file.file0.type.includes('image')){ // Extension it will be an image
                //info.avatar = file_path.split('\\')[2]; // Windows
                var ext = file.file0.type.split('/')[1];
                info.avatar = 'avatar'+request.userInfo.sub+'.'+ext;
                fs.rename(file_path, 'files/avatars/'+info.avatar, (err)=>{});
                //info.avatar = file_path.split('/')[2]; // Linux-mac
            }else{ // Delete file if it is not an image
                fs.unlink(file_path, (err)=>{});
            }
        }
        delete info.password;
        try {
            var nameVal = !validator.isEmpty(info.name),
            surnameVal = !validator.isEmpty(info.surname),
            emailVal = !validator.isEmpty(info.email) && validator.isEmail(info.email)
        } catch (er) {
            return res.status(400).send({
                status: 'Error',
                message: "No Data"
            });
        }
        
        if(nameVal && surnameVal && emailVal){
            var userID = request.userInfo.sub;
            info.email = info.email.toLowerCase();
            //verify if the mail is already taken
            
                User.findOne({email: info.email}, (err, userExists) =>{
                    if(err){
                        return res.status(500).send({
                            status: 'Error',
                            message: "Problem trying to find the email"
                        });
                    }else if(userExists && userExists._id != request.userInfo.sub){
                        return res.status(400).send({
                            status: 'Error',
                            message: "The mail was already taken by another user"
                        });
                    }else{
                        User.findByIdAndUpdate(userID,info,{new:true},(err,userUpdated)=>{
                            if(err || !userUpdated){
                                return res.status(500).send({
                                    status: 'Error',
                                    message: "Problem updating user"
                                });
                            }else if(userUpdated){
                                return res.status(200).send({
                                    status: 'Success',
                                    message: "User was updated",
                                    userU: userUpdated
                                });
                            }
                        });
                    }
                });
        }else{
            return res.status(400).send({
                status: 'Error',
                message: "Problem updating user: Data validation incorrect"
            });
        }      
    },

    getAvatar: function(request, res){
        var fileName = request.params.fileName;
        var pathFile= './files/avatars/'+fileName;

        fs.access(pathFile, fs.constants.F_OK, (err) => {
            if(err){
                return res.status(400).send({
                    status: 'Error',
                    message: "Image doesnt exists"
                });
            }else{
                return res.sendFile(path.resolve(pathFile));
            }
        });
    },

    getUsers: function(request, res){
        User.find({},{"password":0,"role":0},(err, users)=>{
            if(err || !users){
                return res.status(400).send({
                    status: 'Error',
                    message: "There are not users"
                });
            }
            return res.status(200).send({
                status: 'Success',
                users
            });
        });
    },

    getUser: function(request, res){
        var id = request.params.id;
        User.findById(id,{"password":0,"role":0},(err, user)=>{
            if(err || !user){
                return res.status(400).send({
                    status: 'Error',
                    message: "There is not user"
                });
            }
            return res.status(200).send({
                status: 'Success',
                user
            });
        });
    },
};

module.exports = controller;