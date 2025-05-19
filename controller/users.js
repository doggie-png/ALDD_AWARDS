const Users = require('../model/users.js');
const Game = require('../model/games.js');
const bcrypt = require('bcrypt');

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
    const id = req.params.id;
    const { name, mail, password} = req.body;
    const user = await Users.findOneAndUpdate({ id }, { name, mail, password }, { new: true });
    if (user != null) {
     const userRes = user._doc;
      res.json({ message: 'User updated successfully', userRes });
    } else {
      res.status(404).json({ message: `User with ID ${id} not found` });
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

// @desc    Agregar un juego a la lista de juegos en progreso de un usuario
// @route   POST /api/v1/users/:id/add-in-progress
// @access  Public
exports.addGameToInProgress = async (req, res) => {
  try {
    const user = await Users.find({"id": req.params.id}); // Buscar usuario por su ID
    console.dir(user)
    const game = await Game.findById(req.body.gameId); // El ID del juego se pasa en el body
    console.dir(game)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }
    // Agregar el juego a la lista de juegos en progreso
    user[0].gamesInProgress.push(game);
    await user[0].save();

    res.status(200).json({ success: true, message: "Game added to in progress" });
  } catch (error) {
    console.dir(error)
    res.status(500).json({ success: false, message: "Error adding game to in progress" });
  }
};

// @desc    Eliminar un juego de la lista de juegos en progreso de un usuario
// @route   DELETE /api/v1/users/:id/remove-in-progress
// @access  Public
exports.removeGameFromInProgress = async (req, res) => {
  try {
    const user = await Users.find({"id": req.params.id});
    const game = await Game.findById(req.body.gameId); // Buscar por _id del juego

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Eliminar el juego de la lista de juegos en progreso
    user[0].gamesInProgress.pull(game); // Usamos el método pull de MongoDB
    await user[0].save();

    res.status(200).json({ success: true, message: "Game removed from in progress" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing game from in progress" });
  }
};

// @desc    Agregar un juego a la lista de juegos completados de un usuario
// @route   POST /api/v1/users/:id/add-completed
// @access  Public
exports.addGameToCompleted = async (req, res) => {
  try {
    const user = await Users.find({"id": req.params.id});
    const game = await Game.findById(req.body.gameId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Agregar el juego a la lista de juegos completados
    user[0].gamesCompleted.push(game);
    await user[0].save();

    res.status(200).json({ success: true, message: "Game added to completed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding game to completed" });
  }
};

// @desc    Eliminar un juego de la lista de juegos completados de un usuario
// @route   DELETE /api/v1/users/:id/remove-completed
// @access  Public
exports.removeGameFromCompleted = async (req, res) => {
  try {
    const user = await Users.find({"id": req.params.id});
    const game = await Game.findById(req.body.gameId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Eliminar el juego de la lista de juegos completados
    user[0].gamesCompleted.pull(game);
    await user[0].save();

    res.status(200).json({ success: true, message: "Game removed from completed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing game from completed" });
  }
};

// @desc    Agregar un juego a la lista de juegos que le gustan a un usuario
// @route   POST /api/v1/users/:id/add-liked
// @access  Public
exports.addGameToLiked = async (req, res) => {
  try {
    const user = await Users.find({"id": req.params.id});
    const game = await Game.findById(req.body.gameId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Agregar el juego a la lista de juegos que le gustan
    user[0].gamesLiked.push(game);
    await user[0].save();

    res.status(200).json({ success: true, message: "Game added to liked" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding game to liked" });
  }
};

// @desc    Eliminar un juego de la lista de juegos que le gustan a un usuario
// @route   DELETE /api/v1/users/:id/remove-liked
// @access  Public
exports.removeGameFromLiked = async (req, res) => {
  try {
    const user = await Users.find({"id": req.params.id});
    const game = await Game.findById(req.body.gameId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Eliminar el juego de la lista de juegos que le gustan
    user[0].gamesLiked.pull(game);
    await user[0].save();

    res.status(200).json({ success: true, message: "Game removed from liked" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing game from liked" });
  }
};

// @desc    Agregar un juego a la lista de juegos que no le gustan a un usuario
// @route   POST /api/v1/users/:id/add-disliked
// @access  Public
exports.addGameToDisliked = async (req, res) => {
  try {
    const user = await Users.find({"id": req.params.id});
    const game = await Game.findById(req.body.gameId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Agregar el juego a la lista de juegos que no le gustan
    user[0].gamesDisliked.push(game);
    await user[0].save();

    res.status(200).json({ success: true, message: "Game added to disliked" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding game to disliked" });
  }
};

// @desc    Eliminar un juego de la lista de juegos que no le gustan a un usuario
// @route   DELETE /api/v1/users/:id/remove-disliked
// @access  Public
exports.removeGameFromDisliked = async (req, res) => {
  try {
    const user = await Users.find({ "id": req.params.id });
    const game = await Game.findById(req.body.gameId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    // Eliminar el juego de la lista de juegos que no le gustan
    user[0].gamesDisliked.pull(game);
    await user[0].save();

    res.status(200).json({ success: true, message: "Game removed from disliked" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing game from disliked" });
  }
};

////////////////////////////////////////////////

// Registro
exports.registerUser = async (req, res) => {
  try {
    const { id, name, mail, password } = req.body;

    // Validación de campos obligatorios
    if (!id || !name || !mail || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificación si el correo ya está registrado
    const existingUser = await Users.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

     await Users.create(req.body);
     res.status(201).json({ success: true, user: { id, name, mail, password}, message: 'User created successfully' });

  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
  }
};


// Login
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

    res.status(200).json({ user: { id: user._id, name: user.name, mail: user.mail } });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
  }
};

