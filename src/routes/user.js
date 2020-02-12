'use strict'
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userControlles = require('../controllers/user');

//router.get('/prueba', userControlles.prueba);
router.post('/addUser', userControlles.addUser);
router.get('/getUsers', userControlles.getUsers);
router.get('/getUser/:id', [auth.veriryToken], userControlles.getUser);
router.put('/updateUser/:id', [auth.veriryToken, auth.verifyRole], userControlles.updateUser);
router.put('/updateUser', [auth.veriryToken], userControlles.updateUserr);
router.delete('/deleteUser/:id', [auth.veriryToken, auth.verifyRole], userControlles.deleteUser);
router.post('/uploadAvatar', [auth.veriryToken], userControlles.avatar);
router.get('/getAvatar', [auth.veriryToken], userControlles.getAvatar);
//router.delete('/inactivateUser/:id', [auth.veriryToken], userControlles.getUsers);

module.exports = router;