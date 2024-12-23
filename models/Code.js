const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  UserID: {
    type: String,
    required: true,
  },
  Code: {
    type: String,
    required: true,
    unique: true,
  },
  Reward: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  Validity: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Code", codeSchema);
