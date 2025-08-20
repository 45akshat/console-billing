const mongoose = require('mongoose');


const referralLogSchema = new mongoose.Schema({
  referrerId: { type: String, required: true },  // UUID stored as string
  pointsGiven: { type: Number, default: 0 },
  reason: { type: String }, // optional: e.g. "Referral bonus", "Promo", etc.
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('ReferralLog', referralLogSchema);
