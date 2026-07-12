const { pool } = require('../../db/pool');

async function list({ type, status, region, search, sort }) {
  const clauses = [];
  const params = [];

  if (type) {
    params.push(type);
    clauses.push(`vehicle_type = $${params.length}`);
  }
  if (status) {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }
  if (region) {
    params.push(region);
    clauses.push(`region = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    clauses.push(`(registration_number ILIKE $${params.length} OR name ILIKE $${params.length})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const sortMap = {
    name: 'name',
    registration_number: 'registration_number',
    status: 'status',
    created_at: 'created_at',
  };
  const orderBy = sortMap[sort] || 'created_at';

  const { rows } = await pool.query(
    `SELECT * FROM vehicles ${where} ORDER BY ${orderBy} DESC`,
    params
  );
  return rows;
}

async function listAvailable(minCapacity) {
  const params = [];
  let where = `status = 'available'`;
  if (minCapacity) {
    params.push(minCapacity);
    where += ` AND max_load_capacity_kg >= $${params.length}`;
  }
  const { rows } = await pool.query(
    `SELECT * FROM vehicles WHERE ${where} ORDER BY name ASC`,
    params
  );
  return rows;
}

async function findById(id, client = pool) {
  const { rows } = await client.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  return rows[0];
}

async function lockById(id, client) {
  const { rows } = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [id]);
  return rows[0];
}

async function create(data) {
  const { rows } = await pool.query(
    `INSERT INTO vehicles (registration_number, name, model, vehicle_type, region, max_load_capacity_kg, odometer_km, acquisition_cost)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      data.registration_number,
      data.name,
      data.model || null,
      data.vehicle_type,
      data.region || 'central',
      data.max_load_capacity_kg,
      data.odometer_km ?? 0,
      data.acquisition_cost,
    ]
  );
  return rows[0];
}

async function update(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = fields.map((f) => data[f]);
  const { rows } = await pool.query(
    `UPDATE vehicles SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0];
}

async function retire(id, client = pool) {
  const { rows } = await client.query(
    `UPDATE vehicles SET status = 'retired' WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
}

async function setStatus(id, status, client = pool) {
  const { rows } = await client.query(
    `UPDATE vehicles SET status = $2 WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0];
}

async function setStatusAndOdometer(id, status, odometerKm, client = pool) {
  const { rows } = await client.query(
    `UPDATE vehicles SET status = $2, odometer_km = $3 WHERE id = $1 RETURNING *`,
    [id, status, odometerKm]
  );
  return rows[0];
}

module.exports = {
  list,
  listAvailable,
  findById,
  lockById,
  create,
  update,
  retire,
  setStatus,
  setStatusAndOdometer,
};
