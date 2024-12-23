const userService = require('../services/userService');

// Create a new user
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get a user by UserID
const getUserByUserID = async (req, res) => {
  try {
    const userID = req.params.userID;
    const user = await userService.getUserByUserID(userID);
    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

// Update user data
const updateUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const updatedData = req.body;
    const updatedUser = await userService.updateUser(userID, updatedData);
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete user by UserID
const deleteUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const deletedUser = await userService.deleteUser(userID);
    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      message: 'Users retrieved successfully',
      users
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Check if the user logged in today
const checkLoggedInToday = async (req, res) => {
  try {
    const userID = req.params.userID;
    const loggedInToday = await userService.checkLoggedInToday(userID);
    res.status(200).json({
      message: 'User login status checked',
      loggedInToday
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

module.exports = {
  createUser,
  getUserByUserID,
  updateUser,
  deleteUser,
  getAllUsers,
  checkLoggedInToday
};
