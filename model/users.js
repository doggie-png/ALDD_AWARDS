const mongoose = require("mongoose");
const usuariosSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: [true, "Debe ser el nombre del usuario"]
  },
  mail: {
    type: String,
    required: [true, "Debe ser el correo del usuario"]
  },
  password: {
    type: String,
    required: [true, "Debe ser la password del usuario"]
  },

});

const Usuarios = mongoose.model("Users", usuariosSchema);

module.exports = Usuarios;