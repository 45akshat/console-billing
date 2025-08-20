const cpLogService = require('../services/cpLogsService');

exports.getCpLogs = async (req, res) => {
  try {
    let logs = await cpLogService.getAllCpLogs();

    // Get today's and yesterday's day names
    const today = new Date();
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const todayName = days[today.getDay()];
    const yesterdayName = days[(today.getDay() + 6) % 7]; // go back one day

    // Add difference column
    logs = logs.map(log => {
      const todayValue = log.week[todayName] || 0;
      const yesterdayValue = log.week[yesterdayName] || 0;
      const difference = todayValue - yesterdayValue;

      return {
        ...log.toObject(),
        todayName,
        yesterdayName,
        todayValue,
        yesterdayValue,
        difference
      };
    });

    // Sort by highest difference first
    logs.sort((a, b) => b.difference - a.difference);

    res.render('cp/logs', { logs, todayName, yesterdayName });
  } catch (error) {
    console.error('Error fetching CP logs:', error);
    res.status(500).send('Server error while fetching CP logs');
  }
};
