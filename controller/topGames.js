const MostLikedGame = require("../model/mostLikedGames");
const MostDislikedGame = require("../model/mostDislikedGames");
const MostVotedGame = require("../model/mostVotedGames");
const CompletionRateGame = require("../model/highestCompletionRateGames");

// Obtener los 10 juegos con más "Me gusta"
exports.getTopLikedGames = async (req, res) => {
  try {
    const topGames = await MostLikedGame.getTop10();
    res.status(200).json({ success: true, data: topGames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top liked games" });
  }
};

// Obtener los 10 juegos con más "No me gusta"
exports.getTopDislikedGames = async (req, res) => {
  try {
    const topGames = await MostDislikedGame.getTop10();
    res.status(200).json({ success: true, data: topGames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top disliked games" });
  }
};

// Obtener los 10 juegos más votados
exports.getTopVotedGames = async (req, res) => {
  try {
    const topGames = await MostVotedGame.getTop10();
    res.status(200).json({ success: true, data: topGames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top voted games" });
  }
};

// Obtener los 10 juegos con mayor tasa de finalización
exports.getTopCompletionRateGames = async (req, res) => {
  try {
    const topGames = await CompletionRateGame.getTop10();
    res.status(200).json({ success: true, data: topGames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top completion rate games" });
  }
};

// Obtener todos los Top 10 juegos en una sola respuesta
exports.getAllTopGames = async (req, res) => {
  try {
    const [liked, disliked, voted, completed] = await Promise.all([
      MostLikedGame.getTop10(),
      MostDislikedGame.getTop10(),
      MostVotedGame.getTop10(),
      CompletionRateGame.getTop10(),
    ]);

    res.status(200).json({
      success: true,
      topLiked: liked,
      topDisliked: disliked,
      topVoted: voted,
      topCompletionRate: completed,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top games" });
  }
};
