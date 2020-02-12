'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

//subdocumento
let commentSchema = new Schema({

    content: { type: String },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
});

module.exports = commentSchema;

//documento principal
let topicSchema = new Schema({

    title: { type: String, require: [true, 'El titulo es necesario'] },
    content: { type: String, require: [true, 'El contenido es necesario'] },
    code: { type: String },
    lang: { type: String },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    comments: [commentSchema],

});

//cargar plugin de paginate
topicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('topic', topicSchema);