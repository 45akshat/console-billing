const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a new user
router.post('/users', userController.createUser);

// Route to get user by UserID
router.get('/users/:userID', userController.getUserByUserID);

// Route to update user data
router.put('/users/:userID', userController.updateUser);

// Route to delete user by UserID
router.delete('/users/:userID', userController.deleteUser);

// Route to get all users
router.get('/users', userController.getAllUsers);

// Route to check if user logged in today
router.get('/users/:userID/loggedInToday', userController.checkLoggedInToday);

module.exports = router;
