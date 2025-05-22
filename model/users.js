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
  gamesInProgress: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  gamesCompleted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  gamesLiked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  gamesDisliked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  hasVoted: { type: Boolean, default: false } // Track if user has voted

});

const Usuarios = mongoose.model("Users", usuariosSchema);

module.exports = Usuarios;