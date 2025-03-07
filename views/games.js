const express = require("express");
const router = express.Router();
const {
  getGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame
} = require("../controller/games");

// Obtener todos los juegos
router.route("/").get(getGames);

// Crear un nuevo juego
router.route("/").post(createGame);

// Obtener un juego por ID
router.route("/:id").get(getGameById);

// Actualizar un juego por ID
router.route("/:id").patch(updateGame);

// Eliminar un juego por ID
router.route("/:id").delete(deleteGame);

module.exports = router;
