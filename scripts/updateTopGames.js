const mongoose = require("mongoose");
const Usuarios = require("../model/users");
const Game = require("../model/games");
const MostLikedGame = require("../model/mostLikedGames");
const MostDislikedGame = require("../model/mostDislikedGames");
const MostVotedGame = require("../model/mostVotedGames");
const CompletionRateGame = require("../model/highestCompletionRateGames");

async function actualizarMétricas() {
  try {
    // Verify connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection is not open");
    }
    console.log("Running actualizarMétricas at", new Date().toISOString());

    // Resetear métricas en Game
    await Game.updateMany({}, {
      likesCount: 0,
      dislikesCount: 0,
      votes: 0,
      completedCount: 0,
      startedCount: 0,
      completionRate: 0,
      rating: 0
    });
    console.log("Métricas de Game reseteadas");

    // Crear índices idempotentes
    try {
      await Usuarios.collection.createIndex({ gamesLiked: 1 }, { background: true });
      await Usuarios.collection.createIndex({ gamesDisliked: 1 }, { background: true });
      await Usuarios.collection.createIndex({ gamesInProgress: 1 }, { background: true });
      await Usuarios.collection.createIndex({ gamesCompleted: 1 }, { background: true });
      console.log("Índices creados o verificados en Users");
    } catch (indexError) {
      console.warn("Error al crear índices, probablemente ya existen:", indexError.message);
    }

    // Agregación para calcular métricas
    const metrics = await Usuarios.aggregate([
      {
        $facet: {
          liked: [
            { $match: { gamesLiked: { $exists: true, $type: "array" } } },
            { $unwind: { path: "$gamesLiked", preserveNullAndEmptyArrays: true } },
            { $match: { gamesLiked: { $ne: null, $type: "objectId" } } },
            { $group: { _id: "$gamesLiked", likesCount: { $sum: 1 } } }
          ],
          disliked: [
            { $match: { gamesDisliked: { $exists: true, $type: "array" } } },
            { $unwind: { path: "$gamesDisliked", preserveNullAndEmptyArrays: true } },
            { $match: { gamesDisliked: { $ne: null, $type: "objectId" } } },
            { $group: { _id: "$gamesDisliked", dislikesCount: { $sum: 1 } } }
          ],
          inProgress: [
            { $match: { gamesInProgress: { $exists: true, $type: "array" } } },
            { $unwind: { path: "$gamesInProgress", preserveNullAndEmptyArrays: true } },
            { $match: { gamesInProgress: { $ne: null, $type: "objectId" } } },
            { $group: { _id: "$gamesInProgress", startedCount: { $sum: 1 } } }
          ],
          completed: [
            { $match: { gamesCompleted: { $exists: true, $type: "array" } } },
            { $unwind: { path: "$gamesCompleted", preserveNullAndEmptyArrays: true } },
            { $match: { gamesCompleted: { $ne: null, $type: "objectId" } } },
            { $group: { _id: "$gamesCompleted", completedCount: { $sum: 1 } } }
          ]
        }
      },
      {
        $project: {
          games: {
            $concatArrays: ["$liked", "$disliked", "$inProgress", "$completed"]
          }
        }
      },
      { $unwind: "$games" },
      {
        $group: {
          _id: "$games._id",
          likesCount: { $sum: "$games.likesCount" },
          dislikesCount: { $sum: "$games.dislikesCount" },
          startedCount: { $sum: "$games.startedCount" },
          completedCount: { $sum: "$games.completedCount" }
        }
      },
      {
        $project: {
          _id: 1,
          likesCount: { $ifNull: ["$likesCount", 0] },
          dislikesCount: { $ifNull: ["$dislikesCount", 0] },
          startedCount: { $ifNull: ["$startedCount", 0] },
          completedCount: { $ifNull: ["$completedCount", 0] },
          votes: { $add: ["$likesCount", "$dislikesCount"] },
          completionRate: {
            $cond: {
              if: { $gt: ["$startedCount", 0] },
              then: {
                $divide: [
                  { $multiply: ["$completedCount", 100] },
                  "$startedCount"
                ]
              },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          likesCount: 1,
          dislikesCount: 1,
          startedCount: 1,
          completedCount: 1,
          votes: 1,
          completionRate: { $round: ["$completionRate", 2] },
          rating: { $literal: 0 }
        }
      }
    ]);

    // Validar ObjectIds
    const validMetrics = metrics.filter(metric => mongoose.isValidObjectId(metric._id));
    if (metrics.length !== validMetrics.length) {
      console.warn(`Se encontraron ${metrics.length - validMetrics.length} ObjectIds inválidos en la agregación`);
    }

    // Actualizar Game
    const gameOps = validMetrics.map(metric => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(metric._id) },
        update: {
          $set: {
            likesCount: metric.likesCount,
            dislikesCount: metric.dislikesCount,
            votes: metric.votes,
            completedCount: metric.completedCount,
            startedCount: metric.startedCount,
            completionRate: metric.completionRate,
            rating: metric.rating
          }
        }
      }
    }));
    let gameWriteResult = { upsertedCount: 0, modifiedCount: 0 };
    if (gameOps.length > 0) {
      gameWriteResult = await Game.bulkWrite(gameOps);
      console.log(`Game actualizada: ${gameWriteResult.upsertedCount} insertados, ${gameWriteResult.modifiedCount} modificados`);
    }

    // Actualizar colecciones auxiliares
    // MostLikedGame
    const likedOps = validMetrics.map(metric => ({
      updateOne: {
        filter: { gameId: new mongoose.Types.ObjectId(metric._id) },
        update: { $set: { likesCount: metric.likesCount } },
        upsert: true
      }
    }));
    let likedWriteResult = { upsertedCount: 0, modifiedCount: 0 };
    if (likedOps.length > 0) {
      likedWriteResult = await MostLikedGame.bulkWrite(likedOps);
      console.log(`MostLikedGame actualizada: ${likedWriteResult.upsertedCount} insertados, ${likedWriteResult.modifiedCount} modificados`);
    }

    // MostDislikedGame
    const dislikedOps = validMetrics.map(metric => ({
      updateOne: {
        filter: { gameId: new mongoose.Types.ObjectId(metric._id) },
        update: { $set: { dislikesCount: metric.dislikesCount } },
        upsert: true
      }
    }));
    let dislikedWriteResult = { upsertedCount: 0, modifiedCount: 0 };
    if (dislikedOps.length > 0) {
      dislikedWriteResult = await MostDislikedGame.bulkWrite(dislikedOps);
      console.log(`MostDislikedGame actualizada: ${likedWriteResult.upsertedCount} insertados, ${likedWriteResult.modifiedCount} modificados`);
    }

    // MostVotedGame
    const votedOps = validMetrics.map(metric => ({
      updateOne: {
        filter: { gameId: new mongoose.Types.ObjectId(metric._id) },
        update: { $set: { votes: metric.votes } },
        upsert: true
      }
    }));
    let votedWriteResult = { upsertedCount: 0, modifiedCount: 0 };
    if (votedOps.length > 0) {
      votedWriteResult = await MostVotedGame.bulkWrite(votedOps);
      console.log(`MostVotedGame actualizada: ${votedWriteResult.upsertedCount} insertados, ${votedWriteResult.modifiedCount} modificados`);
    }

    // CompletionRateGame
    const completionOps = validMetrics.map(metric => ({
      updateOne: {
        filter: { gameId: new mongoose.Types.ObjectId(metric._id) },
        update: {
          $set: {
            completedCount: metric.completedCount,
            startedCount: metric.startedCount,
            completionRate: metric.completionRate
          }
        },
        upsert: true
      }
    }));
    let completionWriteResult = { upsertedCount: 0, modifiedCount: 0 };
    if (completionOps.length > 0) {
      completionWriteResult = await CompletionRateGame.bulkWrite(completionOps);
      console.log(`CompletionRateGame actualizada: ${completionWriteResult.upsertedCount} insertados, ${completionWriteResult.modifiedCount} modificados`);
    }

    console.log("Actualización de métricas completada.");
  } catch (error) {
    console.error("Error actualizando métricas:", error.message);
    throw error;
  }
}

module.exports = actualizarMétricas;