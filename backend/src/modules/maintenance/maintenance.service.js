const { withTransaction } = require('../../db/pool');
const { DomainError } = require('../../utils/errors');
const repo = require('./maintenance.repo');
const vehiclesRepo = require('../vehicles/vehicles.repo');

async function list(filters) {
  return repo.list(filters);
}

async function open(data, openedBy) {
  return withTransaction(async (client) => {
    const vehicle = await vehiclesRepo.lockById(data.vehicle_id, client);
    if (!vehicle) {
      throw new DomainError('NOT_FOUND', 404, 'Vehicle not found.', 'vehicle_id');
    }
    if (vehicle.status === 'on_trip') {
      throw new DomainError('VEHICLE_ON_TRIP', 409, 'Cannot open maintenance for a vehicle that is on an active trip.');
    }
    if (vehicle.status === 'retired') {
      throw new DomainError('VEHICLE_RETIRED', 409, 'Cannot open maintenance for a retired vehicle.');
    }
    if (vehicle.status === 'in_shop') {
      throw new DomainError('MAINTENANCE_ALREADY_OPEN', 409, 'This vehicle already has an open maintenance job.');
    }

    const log = await repo.create(data, openedBy, client);
    await vehiclesRepo.setStatus(data.vehicle_id, 'in_shop', client);
    return log;
  });
}

async function close(id, cost) {
  return withTransaction(async (client) => {
    const log = await repo.findRawById(id, client);
    if (!log) {
      throw new DomainError('NOT_FOUND', 404, 'Maintenance log not found.');
    }
    if (log.status === 'closed') {
      throw new DomainError('ALREADY_CLOSED', 409, 'This maintenance job is already closed.');
    }

    const updated = await repo.close(id, cost, client);
    const vehicle = await vehiclesRepo.lockById(log.vehicle_id, client);
    if (vehicle && vehicle.status === 'in_shop') {
      await vehiclesRepo.setStatus(log.vehicle_id, 'available', client);
    }
    return updated;
  });
}

module.exports = { list, open, close };
