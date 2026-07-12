const { pool } = require('../../db/pool');

async function list({ status, search }) {
  const clauses = [];
  const params = [];

  if (status) {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    clauses.push(`(full_name ILIKE $${params.length} OR license_number ILIKE $${params.length})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT *, (license_expiry - CURRENT_DATE) AS days_to_expiry
     FROM drivers ${where} ORDER BY created_at DESC`,
    params
  );
  return rows;
}

async function listAvailable() {
  const { rows } = await pool.query(
    `SELECT *, (license_expiry - CURRENT_DATE) AS days_to_expiry
     FROM drivers WHERE status = 'available' AND license_expiry > CURRENT_DATE
     ORDER BY full_name ASC`
  );
  return rows;
}

async function findById(id, client = pool) {
  const { rows } = await client.query('SELECT * FROM drivers WHERE id = $1', [id]);
  return rows[0];
}

async function lockById(id, client) {
  const { rows } = await client.query('SELECT * FROM drivers WHERE id = $1 FOR UPDATE', [id]);
  return rows[0];
}

async function create(data) {
  const { rows } = await pool.query(
    `INSERT INTO drivers (full_name, license_number, license_category, license_expiry, contact_number, safety_score)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      data.full_name,
      data.license_number,
      data.license_category,
      data.license_expiry,
      data.contact_number,
      data.safety_score ?? 100,
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
    `UPDATE drivers SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0];
}

async function setStatus(id, status, client = pool) {
  const { rows } = await client.query(
    `UPDATE drivers SET status = $2 WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0];
}

module.exports = { list, listAvailable, findById, lockById, create, update, setStatus };
