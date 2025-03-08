const mongoose = require("mongoose");

const MostVotedGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  votes: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
});

module.exports = mongoose.model("MostVotedGame", MostVotedGameSchema);
