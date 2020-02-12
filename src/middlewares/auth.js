'use strict'
const jwt = require('jsonwebtoken');
let auth = {};

auth.veriryToken = (req, res, next) => {

    let token = req.get('token');

    if (token != undefined && token != '') {

        jwt.verify(token, process.env.VERIFY_SIGNATURE, (err, decode) => {

            if (err) {
                return res.status(401).json({
                    status: false,
                    message: 'invalid token',
                })
            }

            //console.log(decode.user);
            req.usu = decode.user;
            next();
        });


    } else {
        return res.status(400).json({
            status: false,
            message: 'The token field does not exist or this vacation',
        });
    }

}

auth.verifyRole = (req, res, next) => {


    if (req.usu.role === 'ROLEADMIN') {
        next();
    } else {

        return res.status(401).json({
            status: false,
            message: 'You must be an administrator',
        });
    }
}

module.exports = auth;