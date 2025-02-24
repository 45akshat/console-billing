const User = require('../models/User');

// Create a new user
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

// Get a user by UserID
const getUserByUserID = async (userID) => {
  try {
    const user = await User.findOne({ UserID: userID });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error retrieving user: ${error.message}`);
  }
};

// Update user data
const updateUser = async (userID, updatedData) => {
  try {
    const user = await User.findOneAndUpdate(
      { UserID: userID },
      updatedData,
      { new: true } // Return the updated user object
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// Update user wallet information
const updateUserWallet = async (userID, walletInfo) => {
  try {
    const user = await User.findOneAndUpdate(
      { UserID: userID },
      { Wallet_Info: walletInfo },
      { new: true } // Return the updated user object
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error updating wallet info: ${error.message}`);
  }
};

// Delete user by UserID
const deleteUser = async (userID) => {
  try {
    const user = await User.findOneAndDelete({ UserID: userID });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

// Get all users (example, can be adapted to suit needs)
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(`Error retrieving users: ${error.message}`);
  }
};

// Get all users with their wallet information
const getAllUsersWithWallet = async () => {
  try {
    const users = await User.find({}, 'UserID Name Wallet_Info');
    return users;
  } catch (error) {
    throw new Error(`Error retrieving users with wallet info: ${error.message}`);
  }
};

// Check if the user logged in today
const checkLoggedInToday = async (userID) => {
  try {
    const user = await User.findOne({ UserID: userID });
    if (!user) {
      throw new Error('User not found');
    }
    return user.Logged_In_Today === new Date().toLocaleDateString('en-GB');
  } catch (error) {
    throw new Error(`Error checking login status: ${error.message}`);
  }
};

// Get total balance in wallet of all users combined
const getTotalWalletBalance = async () => {
  try {
    const users = await User.find();
    let totalBalance = 0;
    users.forEach((user) => {
      totalBalance += user.Wallet_Info.Balance;
    });
    return totalBalance;
  } catch (error) {
    throw new Error(`Error calculating total wallet balance: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getUserByUserID,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllUsersWithWallet,
  checkLoggedInToday,
  updateUserWallet,
  getTotalWalletBalance
};
