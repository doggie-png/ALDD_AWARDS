const mongoose = require("mongoose");

const MostDislikedGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  dislikesCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("MostDislikedGame", MostDislikedGameSchema);
