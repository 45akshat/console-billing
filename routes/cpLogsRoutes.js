const express = require('express');
const router = express.Router();
const cpLogController = require('../controllers/cpLogsController');

// Route to view CP logs
router.get('/logs', cpLogController.getCpLogs);

module.exports = router;
