'use strict'
const express = require('express');
const commentController = require('../controllers/comment');
const { veriryToken, verifyRole } = require('../middlewares/auth');
const router = express.Router();

router.post('/addComment/topic/:idTopic', [veriryToken], commentController.addComment);
router.put('/updateComment/:idComment', [veriryToken], commentController.UpdateComment);
router.delete('/deleteComment/:idTopic/:idComment', [veriryToken], commentController.deleteComment);


module.exports = router;