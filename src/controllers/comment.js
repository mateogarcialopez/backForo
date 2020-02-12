'use strict'
const modelComment = require('../models/topic');
const modelTopic = require('../models/topic');
let comment = {};

comment.addComment = (req, res) => {

    let { idTopic } = req.params;

    let newComment = new modelComment({
        content: req.body.content,
        user: req.usu._id
    });

    modelComment.findById(idTopic, (err, topicFound) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err,
            });
        }

        if (!topicFound) {
            return res.status(404).json({
                status: false,
                message: 'Topic not found',
            });
        }

        if (topicFound) {

            topicFound.comments.push(newComment);

            topicFound.save((err, topiSaved) => {

                if (err) {
                    return res.status(500).json({
                        status: false,
                        err,
                    });
                }

                if (topiSaved) {
                    return res.json({
                        status: true,
                        topicFound,
                    });
                }

            });
        }
    });
}

comment.UpdateComment = (req, res) => {

    let { idComment } = req.params;

    modelTopic.findOneAndUpdate({ 'comments._id': idComment }, { '$set': { 'comments.$.content': req.body.content } }, { new: true }, (err, commentUpdated) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err,
            });
        }

        if (!commentUpdated) {
            return res.status(404).json({
                status: false,
                message: 'comment no tfound',
            });
        }

        if (commentUpdated) {
            return res.json({
                status: true,
                commentUpdated,
            });
        }
    });


}

comment.deleteComment = (req, res) => {

    let { idTopic, idComment } = req.params;

    modelTopic.findById(idTopic, (err, topicFound) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err,
            });
        }

        if (!topicFound) {
            return res.status(404).json({
                status: false,
                message: 'topic no tfound',
            });
        }

        if (topicFound) {

            let commentDeleted = topicFound.comments.id(idComment);

            if (commentDeleted) {

                commentDeleted.remove();

                topicFound.save((err) => {

                    if (err) {
                        return res.status(500).json({
                            status: false,
                            err,
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'comment deleted',
                    });

                });

            } else {

                return res.status(404).json({
                    status: false,
                    message: 'comment no tfound',
                });

            }


        }
    });
}


module.exports = comment;
