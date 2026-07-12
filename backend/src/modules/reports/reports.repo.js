const { pool } = require('../../db/pool');

async function vehicleAnalytics() {
  const { rows } = await pool.query('SELECT * FROM v_vehicle_analytics ORDER BY id ASC');
  return rows;
}

async function licenseAlerts() {
  const { rows } = await pool.query('SELECT * FROM v_license_alerts ORDER BY days_left ASC');
  return rows;
}

module.exports = { vehicleAnalytics, licenseAlerts };
