const mongoose = require("mongoose");

const MostDislikedGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  dislikesCount: { type: Number, default: 0 },
});

// Método estático para obtener el Top 10 juegos más "No me gusta"
MostDislikedGameSchema.statics.getTop10 = function () {
  return this.find().sort({ dislikesCount: -1 }).limit(10).populate("gameId");
};

module.exports = mongoose.model("MostDislikedGame", MostDislikedGameSchema);
