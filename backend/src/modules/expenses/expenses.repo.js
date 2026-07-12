const { pool } = require('../../db/pool');

async function list() {
  const { rows } = await pool.query(
    `SELECT e.*, v.registration_number AS vehicle_registration, v.name AS vehicle_name
     FROM expenses e JOIN vehicles v ON v.id = e.vehicle_id
     ORDER BY e.expense_date DESC, e.id DESC`
  );
  return rows;
}

async function create(data, recordedBy) {
  const { rows } = await pool.query(
    `INSERT INTO expenses (vehicle_id, trip_id, category, amount, description, expense_date, recorded_by)
     VALUES ($1,$2,$3,$4,$5, COALESCE($6, CURRENT_DATE), $7) RETURNING *`,
    [
      data.vehicle_id,
      data.trip_id || null,
      data.category,
      data.amount,
      data.description || null,
      data.expense_date || null,
      recordedBy,
    ]
  );
  return rows[0];
}

module.exports = { list, create };
