"use strict";
const topicSchema = require('../models/topic');
let topic = {};

topic.prueba = (req, res) => {
  res.json({ status: true, message: "topic prueba" });
};

topic.addTopic = async (req, res) => {

  try {
    let newTopic = new topicSchema({

      content: req.body.content,
      code: req.body.code,
      lang: req.body.lang,
      user: req.usu._id,
      comments: req.body.comments,
      title: req.body.title

    });

    let topicSaved = await newTopic.save();

    if (topicSaved) {
      return res.json({
        status: true,
        message: 'Topic saved'
      });
    }

  } catch (error) {

    return res.status(500).json({
      status: false,
      error,
    });
  }
}

topic.getTopics = (req, res) => {

  let page = req.params.page;

  if (page == undefined || page == '0' || page == 0 || page == null) {
    page = 1;
  } else {
    page = parseInt(page);
  }

  //opciones de paginacion
  let options = {
    sort: { date: - 1 },
    populate: 'user',
    limit: 5,
    page: page,
  }

  topicSchema.paginate({}, options, (err, topicsFinded) => {

    if (err) {
      return res.status(500).json({
        status: false,
        err,
      });
    }

    if (topicsFinded) {
      return res.json({
        status: true,
        topics: topicsFinded.docs,
        totalDocs: topicsFinded.totalDocs,
        totalPages: topicsFinded.totalPages,
      });
    }

  });
}

topic.getTopic = async (req, res) => {

  let { id } = req.params;

  try {

    let topic = await topicSchema.findById(id)
      .populate('user')
      .sort([['date', 'descending']]);

    if (topic) {
      return res.json({
        status: true,
        topic,
      });
    }

  } catch (error) {

    return res.status(500).json({
      status: false,
      error,
    });
  }
}

topic.getTopicUser = async (req, res) => {

  let { id } = req.params;

  try {

    let topic = await topicSchema.find({ user: id })
      .populate('user')
      .sort([['date', 'descending']]);

    if (topic) {
      return res.json({
        status: true,
        topic,
      });
    }

  } catch (error) {

    return res.status(500).json({
      status: false,
      error,
    });
  }
}

topic.updateTopic = async (req, res) => {

  let { id } = req.params;

  let topicToUpdate = {

    title: req.body.title,
    content: req.body.content,
    code: req.body.code,
    lang: req.body.lang,

  };

  try {

    let topicUpdated = await topicSchema.findOneAndUpdate({ _id: id, user: req.usu._id }, topicToUpdate, { new: true });

    if (!topicUpdated) {
      return res.status(404).json({
        status: false,
        message: 'topic not found',
      });
    }

    if (topicUpdated) {
      return res.status(200).json({
        status: false,
        topicUpdated,
      });
    }


  } catch (error) {

    return res.status(500).json({
      status: false,
      error,
    });
  }
}

topic.deleteTopic = async (req, res) => {

  let { id } = req.params;

  try {

    let topicDeleted = await topicSchema.findOneAndRemove({ _id: id, user: req.usu._id });

    if (!topicDeleted) {
      return res.status(404).json({
        status: false,
        message: 'topic not found',
      });
    }

    if (topicDeleted) {

      return res.json({
        status: true,
        topicDeleted,
      });
    }

  } catch (error) {

    return res.status(500).json({
      status: false,
      error,
    });

  }
}

topic.searchTopic = (req, res) => {

  let { word } = req.params;

  topicSchema.find({
    "$or": [
      { 'title': { '$regex': word, "$options": 'i' } },
      { 'content': { '$regex': word, "$options": 'i' } },
      { 'lang': { '$regex': word, "$options": 'i' } },
      { 'code': { '$regex': word, "$options": 'i' } }

    ]
  }, (err, wordFinded) => {

    if (err) {
      return res.status(500).json({
        status: false,
        err,
      });
    }

    if (!wordFinded) {
      return res.status(404).json({
        status: false,
        message: 'word not found',
      });
    }

    if (wordFinded) {
      return res.status(200).json({
        status: true,
        wordFinded,
      });
    }
  });

};



module.exports = topic;
