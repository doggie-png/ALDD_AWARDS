const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  
  // Contadores de métricas
  likesCount: { type: Number, default: 0 },          // Cantidad de "Me gusta"
  dislikesCount: { type: Number, default: 0 },       // Cantidad de "No me gusta"
  votes: { type: Number, default: 0 },               // Número de votaciones
  rating: { type: Number, min: 0, max: 5, default: 0 },  // Promedio de calificación
  
  // Métricas de finalización
  completedCount: { type: Number, default: 0 },      // Juegos finalizados
  startedCount: { type: Number, default: 0 },        // Juegos iniciados
  completionRate: { type: Number, default: 0 },      // (completedCount / startedCount) * 100
});

module.exports = mongoose.model("Game", GameSchema);
