const express = require("express");
const router = express.Router();
const {
  getTopLikedGames,
  getTopDislikedGames,
  getTopVotedGames,
  getTopCompletionRateGames,
  getAllTopGames,
} = require("../controller/topGames");

router.get('/', (req, res) => {
  res.send('topGames home page')
})

router.route("/top-liked").get(getTopLikedGames);
router.route("/top-disliked").get(getTopDislikedGames);
router.route("/top-voted").get(getTopVotedGames);
router.route("/top-completion-rate").get(getTopCompletionRateGames);
router.route("/all").get(getAllTopGames);

module.exports = router;
