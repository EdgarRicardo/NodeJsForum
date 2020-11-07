'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 4000;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify',false);

mongoose.connect('mongodb://localhost:27017/forumproject',{useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Success in connection to DB");
            //Create server
            app.listen(port, () =>{
                console.log("The server is running");
            })
        })
        .catch(
            error => console.log(error)
        );

module.exports = mongoose;