const express = require("express");
const router = express.Router();
const {
  getTopLikedGames,
  getTopDislikedGames,
  getTopVotedGames,
  getTopCompletionRateGames,
  getAllTopGames,
} = require("../controller/topGames");

router.route("/top-liked", getTopLikedGames);
router.route("/top-disliked", getTopDislikedGames);
router.route("/top-voted", getTopVotedGames);
router.route("/top-completion-rate", getTopCompletionRateGames);
router.route("/all", getAllTopGames);

module.exports = router;
