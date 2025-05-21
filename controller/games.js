// controller/games.js

const Game = require('../model/games');

// @desc    Obtener todos los juegos
// @route   GET /api/v1/games
// @access  Public
exports.getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({ success: true, count: games.length, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching games' });
  }
};

// @desc    Obtener un juego por ID
// @route   GET /api/v1/games/:id
// @access  Public
exports.getGameById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convertir a número
    const game = await Game.findOne({ id });

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.status(200).json({ success: true, data: game });
  } catch (error) {
    console.error('Error en getGameById:', error);
    res.status(500).json({ success: false, message: 'Error fetching game' });
  }
};

// @desc    Crear un nuevo juego
// @route   POST /api/v1/games
// @access  Public
exports.createGame = async (req, res) => {
  try {
    const { id, title, genre, releaseDate } = req.body;

    if (!id || !title || !genre || !releaseDate) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const existingTitle = await Game.findOne({ title });
    if (existingTitle) {
      return res.status(400).json({ message: 'El título ya está registrado.' });
    }
    const existingId = await Game.findOne({ id });
    if (existingId) {
      return res.status(400).json({ message: 'El ID ya está registrado.' });
    }

    const game = await Game.create({ id, title, genre, releaseDate });
    res.status(201).json({ success: true, data: game, message: 'Game created successfully' });
  } catch (error) {
    console.error('Error en createGame:', error);
    res.status(500).json({ success: false, message: 'Error creating game' });
  }
};

// @desc    Actualizar un juego por ID
// @route   PATCH /api/v1/games/:id
// @access  Public
exports.updateGame = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, genre, releaseDate } = req.body;

    const game = await Game.findOneAndUpdate(
      { id },
      { title, genre, releaseDate },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.status(200).json({ success: true, data: game, message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error en updateGame:', error);
    res.status(500).json({ success: false, message: 'Error updating game' });
  }
};

// @desc    Eliminar un juego por ID
// @route   DELETE /api/v1/games/:id
// @access  Public
exports.deleteGame = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const game = await Game.findOneAndDelete({ id });

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.status(200).json({ success: true, message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error en deleteGame:', error);
    res.status(500).json({ success: false, message: 'Error deleting game' });
  }
};