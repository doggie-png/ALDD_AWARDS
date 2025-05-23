const Users = require('../model/users.js');
const Game = require('../model/games.js');
const bcrypt = require('bcrypt');

// @access  Public
exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log(`Fetching user with id: ${id}`); // Debug: confirmar id
    const user = await Users.findOne({ id })
      .populate({
        path: 'gamesInProgress gamesCompleted gamesLiked gamesDisliked',
        model: 'Game',
        select: 'id title genre releaseDate',
      })
      .lean();
    if (user) {
      console.log('Populated user data:', JSON.stringify(user, null, 2));
      res.status(200).json({ success: true, count: 1, data: user });
    } else {
      console.log(`User with id ${id} not found`);
      res.status(404).json({ message: `User with ID ${id} not found` });
    }
  } catch (error) {
    console.error('Error en getUser:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = async (req, res) => {
  const search = await Users.find({});
  res.status(200).json({ success: true, count: search.length, data: search});
};
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUser = async (req, res) => {
  const filtro = req.params.id;
//    const user = await Users.find({"id": id})
  const user = await Users.find({"name": new RegExp(filtro, 'gi')})
  if (user.length > 0) {
      res.status(200).json({ success: true, count: user.length, data: user});
  } else {
    res.status(500).json({ message: `User with filter ${id} not found` });
  }
};
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUser = async (req, res) => {
  const filtro = req.params.mail;
//    const user = await Users.find({"id": id})
  const user = await Users.find({"mail": new RegExp(filtro, 'gi')})
  if (user.length > 0) {
      res.status(200).json({ success: true, count: user.length, data: user});
  } else {
    res.status(500).json({ message: `User with filter ${mail} not found` });
  }
};
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUser = async (req, res) => {
    const id = req.params.id;
//    const user = await Users.find({"id": id})
    const user = await Users.find({"id": id})
    if (user.length > 0) {
        res.status(200).json({ success: true, count: 1, data: user[0]});
    } else {
      res.status(500).json({ message: `User with ID ${id} not found` });
    }
  };
  // @desc    Create new user
// @route   POST /api/v1/create
// @access  Public
exports.createUser = async (req, res) => {
  console.dir(req.body);
  const {id, name, mail, password} = await Users.create(req.body);
  res.status(201).json({ success: true, user: { id, name, mail, password}, message: 'User created successfully' });
};

// @desc    Update a user
// @route   PATCH /api/v1/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, mail, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (mail) {
      const existingUser = await Users.findOne({ mail, id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
      }
      updateData.mail = mail;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres.' });
      }
      updateData.password = password;
    }

    const user = await Users.findOneAndUpdate({ id }, updateData, { new: true });
    if (user) {
      res.json({
        success: true,
        message: 'User updated successfully',
        data: { id: user.id, name: user.name, mail: user.mail },
      });
    } else {
      res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};
  // @desc    Delete a user
  // @route   DELETE /api/v1/users/:id
  // @access  Public
  exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await Users.findOneAndDelete({ "id": id });
    if (user != null) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: `User with ID ${id} not found` });
    }
  };


  //--------------------------GAMES FROM USERS---------------------------------------//
//

// @desc    Add a game to the user's in-progress list
// @route   POST /api/v1/users/:id/add-in-progress
// @access  Public
exports.addGameToInProgress = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    console.log(`Adding game ${gameId} to user ${id} inProgress`);
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      console.log(`User with id ${id} not found`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      console.log(`Game with id ${gameId} not found`);
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    if (!user.gamesInProgress.includes(gameId)) {
      user.gamesInProgress.push(gameId);
      await user.save();
    } else {
      console.log(`Game ${gameId} already in user's inProgress list`);
    }
    const updatedUser = await Users.findOne({ id })
      .populate({
        path: 'gamesInProgress gamesCompleted gamesLiked gamesDisliked',
        model: 'Game',
        select: 'id title genre releaseDate',
      })
      .lean();
    res.status(200).json({
      success: true,
      message: 'Game added to in progress',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en addGameToInProgress:', error);
    res.status(500).json({ success: false, message: 'Error adding game to in progress' });
  }
};

// @desc    Remove a game from the user's in-progress list
// @route   DELETE /api/v1/users/:id/remove-in-progress
// @access  Public
exports.removeGameFromInProgress = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    console.log(`Removing game ${gameId} from user ${id} inProgress`);
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      console.log(`User with id ${id} not found`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      console.log(`Game with id ${gameId} not found`);
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    if (!user.gamesInProgress.includes(gameId)) {
      console.log(`Game ${gameId} not in user's inProgress list`);
      return res.status(400).json({ success: false, message: 'Game not in inProgress list' });
    }
    user.gamesInProgress.pull(gameId);
    await user.save();
    const updatedUser = await Users.findOne({ id })
      .populate({
        path: 'gamesInProgress gamesCompleted gamesLiked gamesDisliked',
        model: 'Game',
        select: 'id title genre releaseDate',
      })
      .lean();
    res.status(200).json({
      success: true,
      message: 'Game removed from in progress',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en removeGameFromInProgress:', error);
    res.status(500).json({ success: false, message: 'Error removing game from in progress' });
  }
};

// @desc    Agregar un juego a la lista de juegos en progreso de un usuario
// @route   POST /api/v1/users/:id/add-in-progress
// @access  Public
exports.addGameToCompleted = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    if (!user.gamesCompleted.includes(gameId)) {
      user.gamesCompleted.push(gameId);
      await user.save();
    }
    res.status(200).json({ success: true, message: 'Game added to completed' });
  } catch (error) {
    console.error('Error en addGameToCompleted:', error);
    res.status(500).json({ success: false, message: 'Error adding game to completed' });
  }
};

// @desc    Eliminar un juego de la lista de juegos completados de un usuario
// @route   DELETE /api/v1/users/user/:id/remove-completed
// @access  Public
exports.removeGameFromCompleted = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    user.gamesCompleted.pull(gameId);
    await user.save();
    const updatedUser = await Users.findOne({ id })
      .populate({
        path: 'gamesInProgress gamesCompleted gamesLiked gamesDisliked',
        model: 'Game',
        select: 'id title genre releaseDate',
      })
      .lean();
    res.status(200).json({
      success: true,
      message: 'Game removed from completed',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en removeGameFromCompleted:', error);
    res.status(500).json({ success: false, message: 'Error removing game from completed' });
  }
};

// @desc    Agregar un juego a la lista de juegos que le gustan a un usuario
// @route   POST /api/v1/users/user/:id/add-liked
// @access  Public
exports.addGameToLiked = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    if (!user.gamesLiked.includes(gameId)) {
      user.gamesLiked.push(gameId);
      await user.save();
    }
    res.status(200).json({ success: true, message: 'Game added to liked' });
  } catch (error) {
    console.error('Error en addGameToLiked:', error);
    res.status(500).json({ success: false, message: 'Error adding game to liked' });
  }
};

// @desc    Eliminar un juego de la lista de juegos que le gustan a un usuario
// @route   DELETE /api/v1/users/user/:id/remove-liked
// @access  Public
exports.removeGameFromLiked = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    user.gamesLiked.pull(gameId);
    await user.save();
    const updatedUser = await Users.findOne({ id })
      .populate({
        path: 'gamesInProgress gamesCompleted gamesLiked gamesDisliked',
        model: 'Game',
        select: 'id title genre releaseDate',
      })
      .lean();
    res.status(200).json({
      success: true,
      message: 'Game removed from liked',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en removeGameFromLiked:', error);
    res.status(500).json({ success: false, message: 'Error removing game from liked' });
  }
};

// @desc    Agregar un juego a la lista de juegos que no le gustan a un usuario
// @route   POST /api/v1/users/user/:id/add-disliked
// @access  Public
exports.addGameToDisliked = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    if (!user.gamesDisliked.includes(gameId)) {
      user.gamesDisliked.push(gameId);
      await user.save();
    }
    res.status(200).json({ success: true, message: 'Game added to disliked' });
  } catch (error) {
    console.error('Error en addGameToDisliked:', error);
    res.status(500).json({ success: false, message: 'Error adding game to disliked' });
  }
};

// @desc    Eliminar un juego de la lista de juegos que no le gustan a un usuario
// @route   DELETE /api/v1/users/user/:id/remove-disliked
// @access  Public
exports.removeGameFromDisliked = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { gameId } = req.body;
    const user = await Users.findOne({ id });
    const game = await Game.findById(gameId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    user.gamesDisliked.pull(gameId);
    await user.save();
    const updatedUser = await Users.findOne({ id })
      .populate({
        path: 'gamesInProgress gamesCompleted gamesLiked gamesDisliked',
        model: 'Game',
        select: 'id title genre releaseDate',
      })
      .lean();
    res.status(200).json({
      success: true,
      message: 'Game removed from disliked',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en removeGameFromDisliked:', error);
    res.status(500).json({ success: false, message: 'Error removing game from disliked' });
  }
};

////////////////////////////////////////////////
// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { id, name, mail, password } = req.body;

    // Validación de campos obligatorios
    if (!id || !name || !mail || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Validación de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Verificar si el correo o ID ya están registrados
    const existingUser = await Users.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }
    const existingId = await Users.findOne({ id });
    if (existingId) {
      return res.status(400).json({ message: 'El ID ya está registrado.' });
    }

    // Crear el usuario
    const user = await Users.create({ id, name, mail, password });

    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, mail: user.mail },
      message: 'Usuario registrado exitosamente',
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
  }
};

// @desc    Login a user
// @route   POST /api/v1/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    const user = await Users.findOne({ mail });
    if (!user) {
      return res.status(401).json({ message: 'Correo no registrado.' });
    }

    // Comparar contraseñas
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    res.status(200).json({
      success: true,
      user: { id: user.id, name: user.name, mail: user.mail },
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
  }
};


