const jwt = require('jsonwebtoken');
const Login = require('../models/Login');
const User = require('../models/User');

// Secret key for signing JWT tokens
const JWT_SECRET = "aksh_"; // Replace with a strong, secure secret key

// Create a new user
async function createUser(locationId, password) {
  try {
    // Check if user already exists
    const existingUser = await Login.findOne({ Location_Id: locationId });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = new Login({ Location_Id: locationId, Password: password });
    await newUser.save();
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Verify user credentials
async function verifyUser(locationId, password) {
  try {
    const user = await Login.findOne({ Location_Id: locationId });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.Password === password) {
      const token = generateToken(user.Location_Id, password);
      return { success: true, token };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Generate JWT token
function generateToken(locationId, password) {
  return jwt.sign({ Location_Id: locationId, password: password }, JWT_SECRET, { expiresIn: '1h' });
}

// Verify JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: 'Invalid or expired token' };
  }
}

// Other helper functions

// Get user by Location_Id
async function getUser(locationId) {
  try {
    const user = await Login.findOne({ Location_Id: locationId });
    if (!user) {
      throw new Error('User not found');
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Update user password
async function updateUserPassword(locationId, newPassword) {
  try {
    
    const user = await Login.findOne({ Location_Id: locationId });
    if (!user) {
      throw new Error('User not found');
    }

    user.Password = newPassword;
    await user.save();
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


// Helper function to sanitize locationId
const sanitizeLocationId = (locationId) => {
  if (locationId !== 'admin' && locationId.includes('-admin')) {
    return locationId.replace('-admin', '');
  }
  return locationId;
};

const getCashInHand = async (locationId) => {
  try {
    locationId = sanitizeLocationId(locationId);

    const login = await Login.findOne({ Location_Id: locationId });
    if (!login) {
      throw new Error(`Login with Location_Id "${locationId}" not found.`);
    }

    return login.cash_in_hand;
  } catch (error) {
    throw new Error(`Error fetching cash_in_hand for Location_Id "${locationId}": ${error.message}`);
  }
};

const updateCashInHand = async (locationId, amountToDeduct) => {
  try {
    if (isNaN(amountToDeduct)) {
      throw new Error('Invalid amountToDeduct: must be a valid number.');
    }

    locationId = sanitizeLocationId(locationId);

    const login = await Login.findOne({ Location_Id: locationId });
    if (!login) {
      throw new Error(`Login with Location_Id "${locationId}" not found.`);
    }

    // Update cash_in_hand
    const newCashInHand = login.cash_in_hand + Number(amountToDeduct);
    login.cash_in_hand = newCashInHand;

    // Save changes
    await login.save();

    return login;
  } catch (error) {
    throw new Error(`Error updating cash_in_hand for Location_Id "${locationId}": ${error.message}`);
  }
};


const deductWalletAmount = async (userId, amountToDeduct) => {
  try {
    const user = await User.findOne({ UserID: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Deduct the amount from the wallet balance
    const newWalletBalance = user.Wallet_Info - parseInt(amountToDeduct);
    if (newWalletBalance < 0) {
      throw new Error('Insufficient wallet balance');
    }

    user.Wallet_Info = newWalletBalance;

    console.log("Deducted amount from wallet");
    return await user.save();
  } catch (error) {
    throw new Error(`Error deducting wallet amount: ${error.message}`);
  }
};

const addWalletAmount = async (userId, amountToAdd) => {
  try {
    const user = await User.findOne({ UserID: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Add the amount to the wallet balance
    const newWalletBalance = user.Wallet_Info + parseInt(amountToAdd);

    user.Wallet_Info = newWalletBalance;

    console.log("Added amount to wallet");
    return await user.save();
  } catch (error) {
    throw new Error(`Error adding wallet amount: ${error.message}`);
  }
};

module.exports = {
  createUser,
  verifyUser,
  generateToken,
  verifyToken,
  getUser,
  updateUserPassword,
  updateCashInHand,
  getCashInHand,
  deductWalletAmount,
  addWalletAmount, // Add the new function to exports
};
