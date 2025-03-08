const mongoose = require("mongoose");

const CompletionRateGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  completedCount: { type: Number, default: 0 },
  startedCount: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 }, // (completedCount / startedCount) * 100
});

module.exports = mongoose.model("CompletionRateGame", CompletionRateGameSchema);
