const ReferralLog = require('../models/referral_logs');

class ReferralLogService {
  // Fetch all referral logs with user details
  async getAllReferralLogs() {
    return await ReferralLog.find()
      .sort({ createdAt: -1 }); // latest first
  }
}

module.exports = new ReferralLogService();
