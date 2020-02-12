'use strict'
let login = {};
require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const userModel = require('../models/user');

login.login = (req, res) => {

    let { email, password } = req.body;

    //validad que el campo password exista y que no venga vacia
    if (password!= undefined && !validator.isEmpty(password)) {

        //busqueda del email en la db
        userModel.findOne({ email }, (err, userlFinded) => {

            //si encuentra un error
            if (err) {
                return res.status(400).json({
                    status: false,
                    err,
                });
            }

            //si no encuentra el usuario
            if (!userlFinded) {
                return res.status(404).json({
                    status: false,
                    message: '(user) or password bad',
                });
            }

            //si encuentra el usuario
            if (userlFinded) {

                //comparando las contraseñas
                if (!bcrypt.compareSync(password, userlFinded.password)) {

                    return res.status(404).json({
                        status: 'failed',
                        message: 'user or (password) bad',
                    });
                }

                //generando el token
                let token = jwt.sign({ 
                    user: userlFinded
                }, process.env.VERIFY_SIGNATURE, { expiresIn: process.env.LIFE_TOKEN });

                return res.json({
                    status: true,
                    token,
                });

            }
        });

    }else{
        return res.status(400).json({
            status: false,
            message: 'you must fill in the fields'
        });
    }

}

module.exports = login;