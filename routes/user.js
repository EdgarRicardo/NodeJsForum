
'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const md_auth = require('../middlewares/auth');
const multiparty = require('connect-multiparty');
const md_files = multiparty({uploadDir: './files/avatars'}); //middleware to upload files

// Test route
router.get('/testUser',controller.test);

// User's Routes
router.post('/register',controller.save);
router.post('/login',controller.login);
router.put('/update',[md_files, md_auth.auth] ,controller.update);
router.get('/getAvatar/:fileName',controller.getAvatar);
router.get('/getUsers',controller.getUsers);+
router.get('/getUsers/:id',controller.getUser);

module.exports = router;