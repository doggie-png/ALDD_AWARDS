const mongoose = require("mongoose");

const MostLikedGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
  likesCount: { type: Number, default: 0 },
});

// Método estático para obtener el Top 10 juegos más "Me gusta"
MostLikedGameSchema.statics.getTop10 = function () {
  return this.find().sort({ likesCount: -1 }).limit(10).populate("gameId");
};

module.exports = mongoose.model("MostLikedGame", MostLikedGameSchema);
