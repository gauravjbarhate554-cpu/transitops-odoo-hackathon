const { pool } = require('../../db/pool');

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.password_hash, r.name AS role_name
     FROM users u JOIN roles r ON r.id = u.role_id
     WHERE u.email = $1`,
    [email]
  );
  return rows[0];
}

async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT u.id, u.full_name, u.email, r.name AS role_name
     FROM users u JOIN roles r ON r.id = u.role_id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0];
}

module.exports = { findUserByEmail, findUserById };
