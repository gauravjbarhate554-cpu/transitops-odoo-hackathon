const { pool } = require('../../db/pool');

const LIST_SELECT = `
  SELECT t.*, v.registration_number AS vehicle_registration, v.name AS vehicle_name,
         d.full_name AS driver_name
  FROM trips t
  JOIN vehicles v ON v.id = t.vehicle_id
  JOIN drivers d ON d.id = t.driver_id
`;

async function list({ status }) {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE t.status = $${params.length}`;
  }
  const { rows } = await pool.query(`${LIST_SELECT} ${where} ORDER BY t.created_at DESC`, params);
  return rows;
}

async function findById(id, client = pool) {
  const { rows } = await client.query(`${LIST_SELECT} WHERE t.id = $1`, [id]);
  return rows[0];
}

async function findRawById(id, client) {
  const { rows } = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [id]);
  return rows[0];
}

async function create(data, createdBy) {
  const { rows } = await pool.query(
    `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      data.source,
      data.destination,
      data.vehicle_id,
      data.driver_id,
      data.cargo_weight_kg,
      data.planned_distance_km,
      data.revenue ?? 0,
      createdBy,
    ]
  );
  return rows[0];
}

async function dispatch(id, startOdometer, client) {
  const { rows } = await client.query(
    `UPDATE trips SET status = 'dispatched', dispatched_at = now(), start_odometer_km = $2
     WHERE id = $1 RETURNING *`,
    [id, startOdometer]
  );
  return rows[0];
}

async function complete(id, payload, client) {
  const { rows } = await client.query(
    `UPDATE trips SET status = 'completed', end_odometer_km = $2, fuel_consumed_l = $3, completed_at = now()
     WHERE id = $1 RETURNING *`,
    [id, payload.end_odometer_km, payload.fuel_consumed_l]
  );
  return rows[0];
}

async function cancel(id, client) {
  const { rows } = await client.query(
    `UPDATE trips SET status = 'cancelled' WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
}

module.exports = { list, findById, findRawById, create, dispatch, complete, cancel };
