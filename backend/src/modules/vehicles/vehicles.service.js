const { withTransaction } = require('../../db/pool');
const { DomainError } = require('../../utils/errors');
const repo = require('./vehicles.repo');

async function list(filters) {
  return repo.list(filters);
}

async function listAvailable(minCapacity) {
  return repo.listAvailable(minCapacity);
}

async function getById(id) {
  const vehicle = await repo.findById(id);
  if (!vehicle) {
    throw new DomainError('NOT_FOUND', 404, 'Vehicle not found.');
  }
  return vehicle;
}

async function create(data) {
  return repo.create(data);
}

async function update(id, data) {
  await getById(id);
  return repo.update(id, data);
}

async function retireVehicle(id) {
  return withTransaction(async (client) => {
    const { rows } = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [id]);
    const vehicle = rows[0];
    if (!vehicle) {
      throw new DomainError('NOT_FOUND', 404, 'Vehicle not found.');
    }
    if (vehicle.status === 'on_trip') {
      throw new DomainError('VEHICLE_ON_TRIP', 409, 'Cannot retire a vehicle that is on an active trip.');
    }
    return repo.retire(id, client);
  });
}

module.exports = { list, listAvailable, getById, create, update, retireVehicle };
