const express = require("express");
const router = express.Router();
const {
  getTopLikedGames,
  getTopDislikedGames,
  getTopVotedGames,
  getTopCompletionRateGames,
  getAllTopGames,
} = require("../controller/topGames");

router.get("/top-liked", getTopLikedGames);
router.get("/top-disliked", getTopDislikedGames);
router.get("/top-voted", getTopVotedGames);
router.get("/top-completion-rate", getTopCompletionRateGames);
router.get("/all", getAllTopGames);

module.exports = router;
