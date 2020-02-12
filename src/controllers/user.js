"use strict";
let user = {};
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");

user.prueba = (req, res) => {
  return res.json({
    status: true
  });
};

user.addUser = async (req, res) => {
  let validateEmail =
    !validator.isEmpty(req.body.email) && validator.isEmail(req.body.email);
  if (validateEmail) {
    try {
      let user = new userModel({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        image: req.body.image,
        role: req.body.role
      });

      let userSaved = await user.save();

      if (userSaved) {
        return res.json({
          status: true,
          message: "user saved successfully",
          userSaved
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        error
      });
    }
  } else {
    return res.status(400).json({
      status: false,
      message: "The email is empty or is bad"
    });
  }
};

//ver usuarios
user.getUsers = (req, res) => {
  userModel.find({}, (err, usersFinded) => {
    if (err) {
      return res.status(500).joson({
        status: false,
        err,
        message: "An error has ocurred"
      });
    }

    if (!usersFinded) {
      return res.status(400).json({
        status: false,
        message: "there is no user"
      });
    }

    if (usersFinded) {
      return res.json({
        status: true,
        usersFinded
      });
    }
  });
};

//ver usuario
user.getUser = async (req, res) => {
  let { id } = req.params;

  try {
    const userFinded = await userModel.findById(id);

    if (!userFinded) {
      return res.status(404).json({
        status: false,
        message: "user not found"
      });
    }

    if (userFinded) {
      return res.json({
        status: true,
        userFinded
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error
    });
  }
};

//editar usuario
user.updateUser = (req, res) => {
  let { id } = req.params;
  let newUser = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    image: req.body.image,
    role: req.body.role
  };

  userModel.findByIdAndUpdate(
    id,
    newUser,
    { new: true, runValidators: true },
    (err, userUpdated) => {
      if (err) {
        return res.status(500).json({
          status: false,
          err,
          message: "An error has ocurred"
        });
      }

      if (!userUpdated) {
        return res.status(400).json({
          status: false,
          message: "User not found"
        });
      }

      if (userUpdated) {
        return res.json({
          status: true,
          userUpdated
        });
      }
    }
  );
};

//eliminar usuario
user.deleteUser = async (req, res) => {
  let { id } = req.params;
  try {
    const userDeleted = await userModel.findByIdAndRemove(id);

    if (!userDeleted) {
      return res.status(404).json({
        status: false,
        message: "user not found"
      });
    }

    if (userDeleted) {
      return res.json({
        status: true,
        userDeleted
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error
    });
  }
};

//editar usuario
user.updateUserr = (req, res) => {
  let id = req.usu._id;
  let newUser = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    image: req.body.image,
    role: req.body.role
  };

  userModel.findByIdAndUpdate(
    id,
    newUser,
    { new: true, runValidators: true },
    (err, userUpdated) => {
      if (err) {
        return res.status(500).json({
          status: false,
          err,
          message: "An error has ocurred"
        });
      }

      if (!userUpdated) {
        return res.status(400).json({
          status: false,
          message: "User not found"
        });
      }

      if (userUpdated) {
        return res.json({
          status: true,
          userUpdated
        });
      }
    }
  );
};

user.avatar = (req, res) => {
  //verificar si existen archivos para subir
  if (!req.files) {
    return res.status(400).json({
      status: false,
      message: "No files to upload"
    });
  }

  //capturar id y avatar(archivo)
  let id = req.usu._id;
  let { avatar } = req.files;

  //separar extension
  let separarNombre = avatar.name.split(".");
  let extension = separarNombre[separarNombre.length - 1];

  //validar extensiones permitidas
  let extensionesPermitidas = ["png", "jpg", "jpeg"];
  if (extensionesPermitidas.indexOf(extension) < 0) {
    //si es <0 significa que no esta en las extensiones permitidas
    return res.status(400).json({
      status: "failed",
      message:
        "Extension no permitida, las extensiones permitidas son " +
        extensionesPermitidas.join(", ")
    });
  }

  //almacenar archivos en carpeta
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  avatar.mv(`uploads/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({
        status: false,
        err
      });
    }

    //asignar avatar al usuario
    asignarAvatar(id, res, nombreArchivo);
  });
};




function asignarAvatar(id, res, nombreAvatar) {
  userModel.findById(id, (err, userFound) => {
    if (err) {
      return res.status(500).json({
        status: false,
        err
      });
    }

    if (userFound) {
      deletePhoto(userFound.image);

      userFound.image = nombreAvatar;

      userFound.save((err, userUpdated) => {
        if (err) {
          return res.status(500).json({
            status: false,
            err
          });
        }

        if (userUpdated) {
          return res.json({
            status: true,
            message: "User updated"
          });
        }
      });
    }
  });
}




function deletePhoto(nombreAvatar) {
  let pathEliminar = path.resolve(__dirname, `../../uploads/${nombreAvatar}`);

  if (fs.existsSync(pathEliminar)) {
    fs.unlinkSync(pathEliminar);
  }
}

user.getAvatar = (req, res) => {
  let id = req.usu._id;

  userModel.findById(id, (err, userFound) => {
    if (err) {
      return res.status(500).json({
        status: false,
        err
      });
    }

    if (!userFound) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    if (userFound) {
      let pathFoto = path.resolve(
        __dirname,
        `../../uploads/${userFound.image}`
      );

      if (fs.existsSync(pathFoto)) {
        return res.sendFile(pathFoto);
      } else {
        return res.status(400).json({
          status: false,
          message: "No hay fotos"
        });
      }
    }
  });
};

module.exports = user;
