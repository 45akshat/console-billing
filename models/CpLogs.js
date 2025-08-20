const mongoose = require('mongoose');

const cpLogSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // UUID stored as string

  // CP logs for each day of the week
  week: {
    monday:   { type: Number, default: 0 },
    tuesday:  { type: Number, default: 0 },
    wednesday:{ type: Number, default: 0 },
    thursday: { type: Number, default: 0 },
    friday:   { type: Number, default: 0 },
    saturday: { type: Number, default: 0 },
    sunday:   { type: Number, default: 0 },
  },

});

module.exports = mongoose.model('cpLog', cpLogSchema);
