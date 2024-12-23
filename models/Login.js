const mongoose = require('mongoose');

// Define the Login schema
const loginSchema = new mongoose.Schema({
  Location_Id: {
    type: String,
    required: true,
    unique: true, // Ensures each Location_Id is unique
  },
  cash_in_hand: {
    type: Number, // Changed from String to Number for numeric data
    required: true,
    default: 0,
  },
  Password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create a model for the Login schema
const Login = mongoose.model('Login', loginSchema);

module.exports = Login;
