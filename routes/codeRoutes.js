const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// router.get('/codes-all', codeController.getAllCodes);


// Route to show all coupons with pagination on frontend
router.get('/logs', codeController.renderCodesPage);

// Create a new code
router.post('/codes', codeController.createCodeController);


// Check if the code belongs to the user and if it's valid
router.get('/codes/:code/user/:userId', codeController.checkCodeForUserController);

// Get a code by its code value
router.get('/codes/:code', codeController.getCodeController);

// Get all codes by user
router.get('/codes/user/:userId', codeController.getCodesByUserController);

// Update code's reward and validity
router.put('/codes/:code', codeController.updateCodeController);

// Delete a code
router.delete('/codes/:code', codeController.deleteCodeController);

// Check if code is valid
router.get('/codes/:code/validity', codeController.checkCodeValidityController);

// Update validity to "Used"
router.put('/codes/:code/validity', codeController.updateValidityController);

module.exports = router;
