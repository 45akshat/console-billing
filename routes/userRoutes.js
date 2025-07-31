const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyJwt = require('../middleware/jwt');


// Route to create a new user
router.post('/users', userController.createUser);
// Route to update user wallet information (use POST and PUT methods for form submission)
router.route('/users/:userID/wallet')
  .post(userController.updateUserWallet)
// Route to render the users' data page
router.get('/users/view', verifyJwt, userController.renderUsersPage);
// Route to get all users with their wallet information
router.get('/users/wallets', userController.getAllUsersWithWallet);
// Route to get user by UserID
router.get('/users/:userID', userController.getUserByUserID);

// Route to update user data
router.put('/users/:userID', userController.updateUser);

// Route to get total wallet balance of all users combined
router.get('/wallets/totalBalance', userController.getTotalWalletBalance);

// Route to delete user by UserID
router.delete('/users/:userID', userController.deleteUser);

// Route to get all users
router.get('/users', userController.getAllUsers);

// Route to check if user logged in today
router.get('/users/:userID/loggedInToday', userController.checkLoggedInToday);

module.exports = router;
