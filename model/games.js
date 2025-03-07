const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  genre: { type: String, required: true },
  releaseDate: { type: Date },
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
