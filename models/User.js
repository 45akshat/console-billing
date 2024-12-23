const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  UserID: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  CP: {
    type: Number,
    required: true,
  },
  Check_In_Time: {
    type: Date,
    default: null,
  },
  Check_In_Status: {
    type: Boolean,
    default: null,
  },
  Wallet_Info: {
    type: Object,
    default: null,
  },
  Current_Streak: {
    type: Number,
    default: 0,
  },
  Wheel_Spun_Today: {
    type: Boolean,
    default: false,
  },
  Logged_In_Today: {
    type: String,
    required: false,
  },
  Password: {
    type: String,
    required: false,
  },
}, { timestamps: true });

// Create a model for the User schema
const User = mongoose.model('User', userSchema);

module.exports = User;
