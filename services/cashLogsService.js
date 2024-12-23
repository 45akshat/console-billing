const CashLog = require('../models/CashLogs');
const { updateCashInHand } = require('./loginService');

// Create a new cash log entry (deposit, withdrawal, or expense)
const createCashLog = async (locationId, transactionType, amount, description) => {
  try {
    // Create a new cash log entry
    const cashLog = new CashLog({
      Location_Id: locationId,
      transaction_type: transactionType,
      amount: amount,
      description: description,
    });

    if(transactionType == 'withdrawal' || transactionType == 'expense'){
      updateCashInHand(locationId, -amount);
    }else{
      updateCashInHand(locationId, amount);
    }

    // Save the cash log to the database
    await cashLog.save();
    return cashLog;
  } catch (error) {
    throw new Error(`Error creating cash log: ${error.message}`);
  }
};

// Get the transaction history for a specific Location_Id
const getTransactionHistory = async (locationId) => {
  try {
    // Fetch all cash logs for the given Location_Id, sorted by date (most recent first)
    const transactionHistory = await CashLog.find({ Location_Id: locationId })
      .sort({ date: -1 })
      .exec();
    return transactionHistory;
  } catch (error) {
    throw new Error(`Error fetching transaction history: ${error.message}`);
  }
};


// Get all transaction history (no filtering, used for admin)
const getAllTransactionHistory = async () => {
  try {
    // Fetch all cash logs, sorted by date (most recent first)
    const transactionHistory = await CashLog.find()
      .sort({ date: -1 })
      .exec();
    return transactionHistory;
  } catch (error) {
    throw new Error(`Error fetching all transaction history: ${error.message}`);
  }
};


const getTransactionHistoryByDateRange = async (locationId, startDate, endDate) => {
  try {
    // Ensure dates are valid and in the correct format
    if (!startDate || !endDate) {
      throw new Error("Both startDate and endDate are required.");
    }

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure endDate includes the entire day by setting the time to the end of the day
    end.setUTCHours(23, 59, 59, 999);

    // Build the query object
    const query = {
      date: {
        $gte: start,
        $lte: end,
      },
    };

    // Add Location_Id to the query only if locationId is not 'admin'
    if (locationId !== 'admin') {
      query.Location_Id = locationId;
    }

    // Fetch logs within the date range
    const transactionHistory = await CashLog.find(query)
      .sort({ date: -1 }) // Most recent first
      .exec();

    return transactionHistory;
  } catch (error) {
    throw new Error(
      `Error fetching transaction history for date range: ${error.message}`
    );
  }
};


// Get the current cash balance for a specific Location_Id
const getCurrentCashBalance = async (locationId) => {
  try {
    // Find the most recent cash log entry for the Location_Id
    const latestCashLog = await CashLog.findOne({ Location_Id: locationId })
      .sort({ date: -1 })
      .exec();

    if (!latestCashLog) {
      return 0; // No cash logs found, return a balance of 0
    }

    return latestCashLog.balance_after_transaction; // Return the balance after the latest transaction
  } catch (error) {
    throw new Error(`Error fetching current cash balance: ${error.message}`);
  }
};

// Get total deposits, withdrawals, or expenses for a specific Location_Id
const getTotalTransactions = async (locationId, transactionType) => {
  try {
    // Validate transaction type
    if (!['deposit', 'withdrawal', 'expense'].includes(transactionType)) {
      throw new Error('Invalid transaction type. Use "deposit", "withdrawal", or "expense".');
    }

    // Aggregate the total amount for the specified transaction type
    const total = await CashLog.aggregate([
      { $match: { Location_Id: locationId, transaction_type: transactionType } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    return total.length > 0 ? total[0].totalAmount : 0; // Return total or 0 if no transactions found
  } catch (error) {
    throw new Error(`Error fetching total ${transactionType}: ${error.message}`);
  }
};

// Get a specific cash log by its ID
const getCashLogById = async (id) => {
  try {
    const cashLog = await CashLog.findById(id);
    if (!cashLog) {
      throw new Error('Cash log not found');
    }
    return cashLog;
  } catch (error) {
    throw new Error(`Error fetching cash log by ID: ${error.message}`);
  }
};

module.exports = {
  createCashLog,
  getTransactionHistory,
  getAllTransactionHistory,
  getTransactionHistoryByDateRange,
  getCurrentCashBalance,
  getTotalTransactions,
  getCashLogById,
};
