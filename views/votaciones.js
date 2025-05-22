const express = require("express");
const router = express.Router();
const MostVotedGame = require("../model/mostVotedGames");
const User = require("../model/users");
const mongoose = require("mongoose");

// GET top 6 most voted games
router.get("/top", async (req, res) => {
  try {
    const topGames = await MostVotedGame.find()
      .sort({ votes: -1 })
      .limit(6)
      .populate("gameId", "title image")
      .lean();
    res.json(
      topGames.map((game) => ({
        id: game.gameId._id.toString(),
        title: game.gameId.title,
        img: game.gameId.image,
        votes: game.votes,
      }))
    );
  } catch (error) {
    console.error("Error fetching top voted games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET user voting status
router.get("/user-status", async (req, res) => {
  try {
    const userId = parseInt(req.query.userId, 10);
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findOne({ id: userId }).select("hasVoted").lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ hasVoted: user.hasVoted });
  } catch (error) {
    console.error("Error checking user voting status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST vote for a game
router.post("/vote", async (req, res) => {
  try {
    const { gameId, userId } = req.body;
    const parsedUserId = parseInt(userId, 10);
    if (!mongoose.isValidObjectId(gameId) || !Number.isInteger(parsedUserId)) {
      return res.status(400).json({ error: "Invalid game or user ID" });
    }

    // Check if user has already voted
    const user = await User.findOne({ id: parsedUserId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.hasVoted) {
      return res.status(403).json({ error: "User has already voted" });
    }

    // Increment rating in MostVotedGame
    const updateResult = await MostVotedGame.updateOne(
      { gameId: new mongoose.Types.ObjectId(gameId) },
      { $inc: { rating: 1 } },
      { upsert: true }
    );

    if (updateResult.matchedCount === 0 && updateResult.upsertedCount === 0) {
      return res.status(404).json({ error: "Game not found in MostVotedGame" });
    }

    // Mark user as having voted
    await User.updateOne(
      { id: parsedUserId },
      { $set: { hasVoted: true } }
    );

    res.json({ message: `Voto registrado para el juego con ID: ${gameId}` });
  } catch (error) {
    console.error("Error processing vote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET top GOTY games (sum of votes and rating)
router.get("/goty", async (req, res) => {
  try {
    const topGOTY = await MostVotedGame.aggregate([
      {
        $lookup: {
          from: "games",
          localField: "gameId",
          foreignField: "_id",
          as: "gameId"
        }
      },
      { $unwind: "$gameId" },
      {
        $project: {
          gameId: {
            _id: "$gameId._id",
            title: "$gameId.title",
            image: "$gameId.image"
          },
          votes: { $ifNull: ["$votes", 0] },
          rating: { $ifNull: ["$rating", 0] },
          totalScore: { $add: [{ $ifNull: ["$votes", 0] }, { $ifNull: ["$rating", 0] }] }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ]);
    res.json(
      topGOTY.map((game) => ({
        id: game.gameId._id.toString(),
        title: game.gameId.title,
        img: game.gameId.image,
        votes: game.votes,
        rating: game.rating,
        totalScore: game.totalScore
      }))
    );
  } catch (error) {
    console.error("Error fetching GOTY games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;