const mongoose = require("mongoose");

const CompletionRateGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  completedCount: { type: Number, default: 0 },
  startedCount: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 }, // (completedCount / startedCount) * 100
});

// Método estático para obtener el Top 10 juegos con mayor tasa de finalización
CompletionRateGameSchema.statics.getTop10 = async function () {
  return await this.find().sort({ completionRate: -1 }).limit(10).populate("gameId");
};

module.exports = mongoose.model("CompletionRateGame", CompletionRateGameSchema);
