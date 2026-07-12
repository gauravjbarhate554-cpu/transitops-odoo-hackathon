const { pool } = require('../../db/pool');

async function list({ status }) {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE m.status = $${params.length}`;
  }
  const { rows } = await pool.query(
    `SELECT m.*, v.registration_number AS vehicle_registration, v.name AS vehicle_name
     FROM maintenance_logs m JOIN vehicles v ON v.id = m.vehicle_id
     ${where} ORDER BY m.opened_at DESC`,
    params
  );
  return rows;
}

async function findRawById(id, client) {
  const { rows } = await client.query('SELECT * FROM maintenance_logs WHERE id = $1 FOR UPDATE', [id]);
  return rows[0];
}

async function create(data, openedBy, client) {
  const { rows } = await client.query(
    `INSERT INTO maintenance_logs (vehicle_id, title, description, opened_by)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [data.vehicle_id, data.title, data.description || null, openedBy]
  );
  return rows[0];
}

async function close(id, cost, client) {
  const { rows } = await client.query(
    `UPDATE maintenance_logs SET status = 'closed', cost = $2, closed_at = now()
     WHERE id = $1 RETURNING *`,
    [id, cost]
  );
  return rows[0];
}

module.exports = { list, findRawById, create, close };
