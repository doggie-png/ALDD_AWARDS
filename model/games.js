const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  releaseDate: { type: String, required: true  },
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
