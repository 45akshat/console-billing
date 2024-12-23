const CashLogsService = require('../services/cashLogsService');
const { getCashInHand } = require('../services/loginService');

// Create a new cash log entry (deposit, withdrawal, or expense)
// Create a new cash log entry (deposit, withdrawal, or expense)
const createCashLog = async (req, res) => {
  // Get locationId from decoded JWT user data
  let locationId = req.user.Location_Id;

  if (locationId !== 'admin') {
    // Remove '-admin' from locationId if it contains it
    locationId = locationId.includes('-admin') 
        ? locationId.replace('-admin', '') 
        : locationId;
}

  
  // Get other fields from request body
  const { transactionType, amount, description } = req.body;

  // Validate the required fields
  if (!transactionType || !amount ) {
    return res.status(400).json({ message: 'Transaction type, amount, and balance after transaction are required' });
  }

  try {
    // Call the service to create the new cash log entry
    const newCashLog = await CashLogsService.createCashLog(
      locationId,  // Use locationId from JWT
      transactionType,
      amount,
      description,
    );

    // Return success response with the created cash log data
    return res.status(201).json({ message: 'Cash log created successfully', data: newCashLog });
  } catch (error) {
    // Return error response in case of failure
    return res.status(500).json({ message: `Error creating cash log: ${error.message}` });
  }
};


// Get the transaction history for a specific Location_Id
const getTransactionHistory = async (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

  try {
    const transactionHistory = await CashLogsService.getTransactionHistory(locationId);
    return res.status(200).json({ data: transactionHistory });
  } catch (error) {
    return res.status(500).json({ message: `Error fetching transaction history: ${error.message}` });
  }
};

const getTransactionsByDateController = async (req, res) => {
  const { locationId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const transactions = await getTransactionHistoryByDateRange(
      locationId,
      startDate,
      endDate
    );
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get the current cash balance for a specific Location_Id
const getCurrentCashBalance = async (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

  try {
    const currentBalance = await CashLogsService.getCurrentCashBalance(locationId);
    return res.status(200).json({ data: { currentBalance } });
  } catch (error) {
    return res.status(500).json({ message: `Error fetching current cash balance: ${error.message}` });
  }
};

// Get the total amount of deposits, withdrawals, or expenses for a specific Location_Id
const getTotalTransactions = async (req, res) => {
  const { locationId, transactionType } = req.params;

  if (!locationId || !transactionType) {
    return res.status(400).json({ message: 'Location ID and transaction type are required' });
  }

  try {
    const totalAmount = await CashLogsService.getTotalTransactions(locationId, transactionType);
    return res.status(200).json({ data: { totalAmount } });
  } catch (error) {
    return res.status(500).json({ message: `Error fetching total transactions: ${error.message}` });
  }
};

// Get a specific cash log entry by ID
const getCashLogById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Cash log ID is required' });
  }

  try {
    const cashLog = await CashLogsService.getCashLogById(id);
    return res.status(200).json({ data: cashLog });
  } catch (error) {
    return res.status(500).json({ message: `Error fetching cash log by ID: ${error.message}` });
  }
};

// Render the main page to display cash logs for a specific location
const renderCashLogsPage = async (req, res) => {
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

  // Get the current date (today)
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Get the start and end dates from query parameters, default to today if not provided
  const { startDate = today, endDate = today } = req.query;

  let cashInHand = await getCashInHand(locationId);
  console.log(cashInHand);
  try {
    let transactionHistory;
    if (locationId !== 'admin') {
      // Remove '-admin' from locationId if it contains it
      locationId = locationId.includes('-admin') 
          ? locationId.replace('-admin', '') 
          : locationId;
  }

      transactionHistory = await CashLogsService.getTransactionHistoryByDateRange(
        locationId,
        startDate,
        endDate,
      );

      console.log(transactionHistory);

    // Render the EJS view and pass the data
    return res.render('cashlogs/main', {
      locationId: locationId,
      transactions: transactionHistory,
      startDate: startDate,
      endDate: endDate,
      cashInHand: cashInHand,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error fetching transaction history: ${error.message}` });
  }
};


// Render the Create Cash Log Form for a specific location
const renderCreateCashLogPage = (req, res) => {
  // Get locationId from the decoded JWT user data
  let locationId = req.user.Location_Id;

  if (locationId !== 'admin') {
    // Remove '-admin' from locationId if it contains it
    locationId = locationId.includes('-admin') 
        ? locationId.replace('-admin', '') 
        : locationId;
}


  // Render the 'create' view and pass locationId to the template
  res.render('cashlogs/create', { locationId });
};

  

module.exports = {
  createCashLog,
  renderCashLogsPage,
  renderCreateCashLogPage,
  getTransactionHistory,
  getCurrentCashBalance,
  getTotalTransactions,
  getTransactionsByDateController,
  getCashLogById,
};
