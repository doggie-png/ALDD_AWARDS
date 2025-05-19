const mongoose = require("mongoose");
const Usuarios = require("../model/users");
const Game = require("../model/games");
const MostLikedGame = require("../model/mostLikedGames");
const MostDislikedGame = require("../model/mostDislikedGames");
const MostVotedGame = require("../model/mostVotedGames");
const CompletionRateGame = require("../model/highestCompletionRateGames");

// Conexión a la base de datos
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function actualizarMétricas() {
  try {
    // Resetear conteos en todos los juegos
    await Game.updateMany({}, {
      likesCount: 0,
      dislikesCount: 0,
      votes: 0,
      completedCount: 0,
      startedCount: 0,
      completionRate: 0,
    });

    const usuarios = await Usuarios.find();

    // Recalcular métricas
    for (const user of usuarios) {
      for (const likedGameId of user.gamesLiked) {
        await Game.findByIdAndUpdate(likedGameId, { $inc: { likesCount: 1 } });
      }
      for (const dislikedGameId of user.gamesDisliked) {
        await Game.findByIdAndUpdate(dislikedGameId, { $inc: { dislikesCount: 1 } });
      }
      for (const startedGameId of user.gamesInProgress) {
        await Game.findByIdAndUpdate(startedGameId, { $inc: { startedCount: 1 } });
      }
      for (const completedGameId of user.gamesCompleted) {
        await Game.findByIdAndUpdate(completedGameId, { $inc: { completedCount: 1 } });
      }
    }

    // Calcular votes y completionRate
    const games = await Game.find();
    for (const game of games) {
      const votes = game.likesCount + game.dislikesCount;
      const completionRate = game.startedCount > 0
        ? (game.completedCount / game.startedCount) * 100
        : 0;

      await Game.findByIdAndUpdate(game._id, {
        votes,
        completionRate,
      });
    }

    // Actualizar colecciones auxiliares
    await MostLikedGame.deleteMany({});
    await MostDislikedGame.deleteMany({});
    await MostVotedGame.deleteMany({});
    await CompletionRateGame.deleteMany({});

    const allGames = await Game.find();

    for (const game of allGames) {
      await MostLikedGame.create({ gameId: game._id, likesCount: game.likesCount });
      await MostDislikedGame.create({ gameId: game._id, dislikesCount: game.dislikesCount });
      await MostVotedGame.create({ gameId: game._id, votes: game.votes });
      await CompletionRateGame.create({ gameId: game._id, completionRate: game.completionRate });
    }

    console.log("Actualización de métricas completada.");
  } catch (error) {
    console.error("Error actualizando métricas:", error);
  } finally {
    mongoose.connection.close();
  }
}

actualizarMétricas();
module.exports = actualizarMétricas;