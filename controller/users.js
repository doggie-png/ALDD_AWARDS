const Users = require('../model/users.js') 
const users = [ { id: 1, name: 'Hadi Soufan' }, { id: 2, name: 'Melia Malik' }, { id: 3, name: 'Zayn Cerny' }];

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
  const {id, name} = await Users.create(req.body);
  res.status(201).json({ success: true, user: { id, name }, message: 'User created successfully' });
};

// @desc    Update a user
// @route   PATCH /api/v1/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const user = await Users.findOneAndUpdate({ "id": id }, { "name": name });
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
  