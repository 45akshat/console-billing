const express = require('express');
const router = express.Router();
const cashLogsController = require('../controllers/cashLogsController');
const verifyJwt = require('../middleware/jwt');

// Route to create a new cash log
router.post('/cashlogs', verifyJwt, cashLogsController.createCashLog);

// Route to render the create cash log form
router.get('/create', verifyJwt, cashLogsController.renderCreateCashLogPage);

// Route to render the cash logs page for a specific location
router.get('/all',verifyJwt, cashLogsController.renderCashLogsPage); 

// Route to get transactions by date range for a specific location
router.get('/transactions/:locationId', cashLogsController.getTransactionsByDateController);

// Route to get transaction history by Location_Id
router.get('/cashlogs/history/:locationId', cashLogsController.getTransactionHistory);

// Route to get current cash balance by Location_Id
router.get('/cashlogs/balance/:locationId', cashLogsController.getCurrentCashBalance);

// Route to get total transactions (deposit, withdrawal, or expense) for a Location_Id
router.get('/cashlogs/total/:locationId/:transactionType', cashLogsController.getTotalTransactions);

// Route to get a specific cash log entry by ID
router.get('/cashlogs/:id', cashLogsController.getCashLogById);

module.exports = router;
