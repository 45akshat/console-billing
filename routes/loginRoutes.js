const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

// Route to render the create session form (GET request)
router.get('/', loginController.renderLoginPage); 
router.get('/new', loginController.renderCreateAccPage); 
router.get('/pull-out', loginController.renderChangePasswordPage); 

router.post('/create', loginController.createUser);
router.post('/login', loginController.verifyUser);
router.get('/getcash/:Location_Id', loginController.getCashInHandController);
router.get('/verify-token', loginController.verifyToken);
router.get('/user/:Location_Id', loginController.getUser);
router.post('/update-password', loginController.updateUserPassword);

module.exports = router;
