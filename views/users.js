const express = require('express'); const router = express.Router()
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
const { 
  getUsers,
  getUser, 
  createUser, 
  updateUser, 
  deleteUser,  
  addGameToInProgress,
  removeGameFromInProgress,
  addGameToCompleted,
  removeGameFromCompleted,
  addGameToLiked,
  removeGameFromLiked,
  addGameToDisliked,
  removeGameFromDisliked, } = 
require('../controller/users');

router.get('/', (req, res) => {
  res.send('Users home page')
})
router.get('/about', (req, res) => {
  res.send('About users')
})
router.route('/users').get(getUsers); // Read: Get all users
router.route('/create').post(createUser); // Create: Create a new user  
router.route('/user/:id')
  .patch(updateUser) // Update: Update a user by ID
  .delete(deleteUser) // Delete: Delete a user by ID
  .get(getUser);


  //--------------------------GAMES FROM USERS---------------------------------------//

// Agregar y eliminar juegos de las listas correspondientes
router.route("/user/:id/add-in-progress").post(addGameToInProgress);
router.route("/user/:id/remove-in-progress").delete(removeGameFromInProgress);

router.route("/user/:id/add-completed").post(addGameToCompleted);
router.route("/user/:id/remove-completed").delete(removeGameFromCompleted);

router.route("/user/:id/add-liked").post(addGameToLiked);
router.route("/user/:id/remove-liked").delete(removeGameFromLiked);

router.route("/user/:id/add-disliked").post(addGameToDisliked);
router.route("/user/:id/remove-disliked").delete(removeGameFromDisliked)

module.exports = router
