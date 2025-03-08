const mongoose = require("mongoose");

const MostLikedGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  likesCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("MostLikedGame", MostLikedGameSchema);
