'use strict'
const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./login'));
app.use(require('./topic'));
app.use(require('./comment'));

module.exports = app;