const express = require('express');
const router = express.Router();
const referralLogController = require('../controllers/referralLogsController');

// Route to view referral logs
router.get('/logs', referralLogController.getReferralLogs);

module.exports = router;
