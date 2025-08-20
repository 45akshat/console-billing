const referralLogsService = require("../services/referralLogsService");

exports.getReferralLogs = async (req, res) => {
  try {
    const logs = await referralLogsService.getAllReferralLogs();
    res.render('referrals/logs', { logs }); // pass logs to EJS
  } catch (error) {
    console.error('Error fetching referral logs:', error);
    res.status(500).send('Server error while fetching referral logs');
  }
};
