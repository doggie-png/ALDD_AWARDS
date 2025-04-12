const mongoose = require("mongoose");

const MostVotedGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  votes: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
});

// Método estático para obtener el Top 10 juegos más votados
MostVotedGameSchema.statics.getTop10 = async function () {
  return await this.find().sort({ votes: -1 }).limit(10).populate("gameId");
};

module.exports = mongoose.model("MostVotedGame", MostVotedGameSchema);
