'use strict'

const user = require('../models/user');

const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'secretToken@jeje';

exports.auth = function(request, res, next){
    if(!request.headers.authorization){
        return res.status(400).send({
            message: "Request doesn't have header authorization"
        });
    }

    var token = request.headers.authorization. replace(/['"]+/g,'');

    //Decode Token
    try {
        var payload = jwt.decode(token, key);
        if(payload.exp <= moment().unix()){
            return res.status(400).send({
                message: "Expired token"
            });
        }
    } catch (error) {
        return res.status(400).send({
            message: "Token is invalid"
        });
    }
    request.userInfo = payload;
    next();
}