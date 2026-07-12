const { withTransaction } = require('../../db/pool');
const { DomainError } = require('../../utils/errors');
const repo = require('./drivers.repo');

async function list(filters) {
  return repo.list(filters);
}

async function listAvailable() {
  return repo.listAvailable();
}

async function getById(id) {
  const driver = await repo.findById(id);
  if (!driver) {
    throw new DomainError('NOT_FOUND', 404, 'Driver not found.');
  }
  return driver;
}

async function create(data) {
  return repo.create(data);
}

async function update(id, data) {
  await getById(id);
  return repo.update(id, data);
}

async function transition(id, targetStatus, allowedFrom) {
  return withTransaction(async (client) => {
    const { rows } = await client.query('SELECT * FROM drivers WHERE id = $1 FOR UPDATE', [id]);
    const driver = rows[0];
    if (!driver) {
      throw new DomainError('NOT_FOUND', 404, 'Driver not found.');
    }
    if (driver.status === 'on_trip') {
      throw new DomainError('DRIVER_ON_TRIP', 409, 'Complete or cancel the active trip first.');
    }
    if (!allowedFrom.includes(driver.status)) {
      throw new DomainError(
        'INVALID_STATUS_TRANSITION',
        409,
        `Cannot move driver from ${driver.status} to ${targetStatus}.`
      );
    }
    return repo.setStatus(id, targetStatus, client);
  });
}

async function suspend(id) {
  return transition(id, 'suspended', ['available', 'off_duty']);
}

async function reinstate(id) {
  return transition(id, 'available', ['suspended']);
}

async function offDuty(id) {
  return transition(id, 'off_duty', ['available']);
}

async function onDuty(id) {
  return transition(id, 'available', ['off_duty']);
}

module.exports = { list, listAvailable, getById, create, update, suspend, reinstate, offDuty, onDuty };
