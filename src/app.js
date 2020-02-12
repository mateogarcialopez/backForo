'use strict'
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('./config/config');
const app = express();


//middleweares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//routes
app.use('/api', require('./routes/index'));

//DB
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.urlDB, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('conexion establecida');
});


//server
app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto', process.env.PORT);
});