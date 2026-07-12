const repo = require('./reports.repo');
const { toCsv } = require('./csv');

async function vehicleAnalytics(req, res, next) {
  try {
    const rows = await repo.vehicleAnalytics();
    res.status(200).json({ vehicles: rows });
  } catch (err) {
    next(err);
  }
}

async function vehicleAnalyticsCsv(req, res, next) {
  try {
    const rows = await repo.vehicleAnalytics();
    const csv = toCsv(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vehicle-analytics.csv"');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

async function licenseAlerts(req, res, next) {
  try {
    const rows = await repo.licenseAlerts();
    res.status(200).json({ alerts: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { vehicleAnalytics, vehicleAnalyticsCsv, licenseAlerts };
