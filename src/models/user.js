'use strict'
const mongoose = require('mongoose');
const schema = mongoose.Schema;


let rolesValidos = {
    values: ['ROLEUSER', 'ROLEADMIN'],
    message: '{VALUE} no es un valor valido',
};

let userSchema = new schema({

    name: { type: String, require: [true, 'El nombre es necesario'] },
    surname: { type: String, require: [true, 'El apellido es necesario'] },
    email: { type: String, unique: true, require: [true, 'El email es necesario'] },
    password: { type: String, require: [true, 'La contraseña es necesario'] },
    image: { type: String, default: null },
    role: { type: String, default: 'USERROLE', enum: rolesValidos }

});

userSchema.methods.toJSON = function () {

    let user = this;
    let userObjetct = user.toObject();
    delete userObjetct.password;

    return userObjetct;
}

//unValidators: true

module.exports = mongoose.model('user', userSchema);