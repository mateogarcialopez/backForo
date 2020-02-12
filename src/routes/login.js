const express =require('express');
const router = express.Router();
const controllerUser = require('../controllers/login');

router.post('/login', controllerUser.login);

module.exports = router;
