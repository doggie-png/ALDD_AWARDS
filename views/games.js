const express = require("express");
const router = express.Router();
const { getGames, createGame } = require("../controller/games");

router.get('/', (req, res) => {
    res.send('Games home page')
  })

router.route("/games").get(getGames);
router.route("/create").post(createGame);

module.exports = router;
