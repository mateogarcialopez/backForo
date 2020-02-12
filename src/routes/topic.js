const express = require("express");
const router = express.Router();
const { veriryToken, verifyRole } = require('../middlewares/auth');
const topicController = require("../controllers/topic");

router.get("/topicSearch/:word", [veriryToken], topicController.searchTopic);
router.post("/addTopic", [veriryToken], topicController.addTopic);
router.get('/getTopics/:page?', [veriryToken], topicController.getTopics);
router.get('/getTopic/:id', [veriryToken], topicController.getTopic);
router.get('/getTopicUser/:id', [veriryToken], topicController.getTopicUser);
router.put('/topicUpdate/:id', [veriryToken], topicController.updateTopic);
router.delete('/topicDeleted/:id', [veriryToken, topicController.deleteTopic]);

module.exports = router;
