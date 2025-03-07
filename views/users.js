const express = require('express'); const router = express.Router()
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
const { getUsers, getUser, createUser, updateUser, deleteUser } = 
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

module.exports = router
