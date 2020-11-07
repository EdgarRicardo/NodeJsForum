'use strict';
const express = require('express');
const  router = express.Router();
const  controller = require('../controllers/comment');
const  md_auth = require('../middlewares/auth');
const  multiparty = require('connect-multiparty');
const  md_files = multiparty({uploadDir: './files/avatars'});


// Test route
router.get('/testComment',controller.test);
router.delete('/comment/:idComment',md_auth.auth,controller.delete);
router.put('/comment/:idComment',md_auth.auth,controller.update);
router.post('/comment/:idTopic',md_auth.auth,controller.new);
router.get('/comment/:idTopic',controller.getComments);

module.exports = router;