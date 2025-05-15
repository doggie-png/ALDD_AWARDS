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

// @desc    Obtener un juego por ID
// @route   GET /api/v1/games/:id
// @access  Public
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.find({ "id": req.params.id});

    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    res.status(200).json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching game" });
  }
};

// @desc    Crear un nuevo juego
// @route   POST /api/v1/games
// @access  Public
exports.createGame = async (req, res) => {
    try {
      const { id, title, genre, releaseDate } = req.body;
  
      // Verificar si el juego ya existe en la base de datos
      const existingID = await Game.find({  "id": req.params.id });
      if (existingID) {
        return res.status(400).json({ success: false, message: "Game already exists" });
      }
      const existingGame = await Game.find({ "title": req.params.title });
      if (existingGame) {
        return res.status(400).json({ success: fals1e, message: "Game already exists" });
      }
  
      const game = await Game.create({ id, title, genre, releaseDate });
      res.status(201).json({ success: true, data: game, message: "Game created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating game" });
    }
  };
  
// @desc    Actualizar un juego por ID
// @route   PATCH /api/v1/games/:id
// @access  Public
exports.updateGame = async (req, res) => {
  try {
    const { title, genre, releaseDate } = req.body;
    
    // Buscamos el juego por su ID
    const game = await Game.findOneAndUpdate(
      { "id": req.params.id },
      { title, genre, releaseDate },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    res.status(200).json({ success: true, data: game, message: "Game updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating game" });
  }
};

// @desc    Eliminar un juego por ID
// @route   DELETE /api/v1/games/:id
// @access  Public
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({ "id": req.params.id });

    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    res.status(200).json({ success: true, message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting game" });
  }
};
