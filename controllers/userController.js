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


const fetchUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { Name: { $regex: search, $options: 'i' } },
            { UserID: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(query).skip(offset).limit(limit);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
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

// Get all users with their wallet information
const getAllUsersWithWallet = async (req, res) => {
  try {
    const users = await userService.getAllUsersWithWallet();
    res.status(200).json({
      message: 'Users with wallet info retrieved successfully',
      users
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Render the users' data page
const renderUsersPage = async (req, res) => {
  try {
      // Get locationId from the decoded JWT user data
  let locationId = req.user.Location_Id;

  if (locationId !== 'admin') {
    // Remove '-admin' from locationId if it contains it
    locationId = locationId.includes('-admin') 
        ? locationId.replace('-admin', '') 
        : locationId;
}


  if (!locationId) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

    const users = await userService.getAllUsersWithWallet();
    return res.render('users/index', { users });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update user wallet information
const updateUserWallet = async (req, res) => {
  try {
    const userID = req.params.userID;
    const walletInfo = JSON.parse(req.body.Wallet_Info);
    const updatedUser = await userService.updateUserWallet(userID, walletInfo);
    res.status(200).json({
      message: 'User wallet updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get total balance in wallet of all users combined
const getTotalWalletBalance = async (req, res) => {
  try {
    const totalBalance = await userService.getTotalWalletBalance();
    res.status(200).json({
      message: 'Total wallet balance retrieved successfully',
      totalBalance
    });
  } catch (error) {
    res.status(500).json({
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
  checkLoggedInToday,
  getAllUsersWithWallet,
  renderUsersPage,
  updateUserWallet,
  getTotalWalletBalance
};
