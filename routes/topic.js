'use strict';
const express = require('express');
const  router = express.Router();
const  controller = require('../controllers/topic');
const  md_auth = require('../middlewares/auth');
const  multiparty = require('connect-multiparty');
const  md_files = multiparty({uploadDir: './files/avatars'});


// Test route
router.get('/testTopic',controller.test);
router.delete('/topic/:id',md_auth.auth,controller.delete);
router.put('/topic/:id',md_auth.auth,controller.update);
router.post('/topic',md_auth.auth,controller.new);
router.get('/topic',controller.getTopics);
router.get('/topic/byuser/:id',controller.getTopicByUser);
router.get('/topic/:id',controller.getTopic);

module.exports = router;