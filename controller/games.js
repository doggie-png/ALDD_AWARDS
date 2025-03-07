const Game = require("../model/games");

// @desc    Obtener todos los juegos
// @route   GET /api/v1/games
// @access  Public
exports.getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({ success: true, count: games.length, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching games" });
  }
};

// @desc    Crear un nuevo juego
// @route   POST /api/v1/games
// @access  Public
exports.createGame = async (req, res) => {
    try {
      const { id, title, genre, releaseDate } = req.body;
  
      // Verificar si el juego ya existe en la base de datos
      const existingID = await Game.findOne({ id });
      if (existingID) {
        return res.status(400).json({ success: false, message: "Game already exists" });
      }
      const existingGame = await Game.findOne({ title });
      if (existingGame) {
        return res.status(400).json({ success: false, message: "Game already exists" });
      }
  
      const game = await Game.create({ id, title, genre, releaseDate });
      res.status(201).json({ success: true, data: game, message: "Game created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating game" });
    }
  };
  
