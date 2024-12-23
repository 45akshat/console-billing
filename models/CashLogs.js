const mongoose = require('mongoose');

// Define the CashLogs schema
const cashLogSchema = new mongoose.Schema({
  Location_Id: {
    type: String,
    required: true,
    ref: 'Login', // Assuming the Location_Id relates to the Login model
  },
  transaction_type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'expense'], // Defines the transaction type (Deposit, Withdrawal, or Expense)
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Amount involved in the transaction (positive number)
  },
  description: {
    type: String,
    required: false, // Optional description for the transaction
  },
  date: {
    type: Date,
    default: Date.now, // Defaults to the current date if not provided
  },
}, { timestamps: true });

// Create a model for the CashLogs schema
const CashLog = mongoose.model('CashLog', cashLogSchema);

module.exports = CashLog;
