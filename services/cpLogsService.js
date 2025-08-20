const CpLog = require('../models/CpLogs');

class CpLogService {
  async getAllCpLogs() {
    return await CpLog.find().sort({ _id: -1 }); // latest first
  }
}

module.exports = new CpLogService();
