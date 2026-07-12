const { pool } = require('../../db/pool');

async function list() {
  const { rows } = await pool.query(
    `SELECT f.*, v.registration_number AS vehicle_registration, v.name AS vehicle_name
     FROM fuel_logs f JOIN vehicles v ON v.id = f.vehicle_id
     ORDER BY f.log_date DESC, f.id DESC`
  );
  return rows;
}

async function create(data, recordedBy) {
  const { rows } = await pool.query(
    `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date, recorded_by)
     VALUES ($1,$2,$3,$4, COALESCE($5, CURRENT_DATE), $6) RETURNING *`,
    [data.vehicle_id, data.trip_id || null, data.liters, data.cost, data.log_date || null, recordedBy]
  );
  return rows[0];
}

module.exports = { list, create };
