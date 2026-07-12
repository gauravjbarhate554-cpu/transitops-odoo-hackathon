const { withTransaction } = require('../../db/pool');
const { DomainError } = require('../../utils/errors');
const tripsRepo = require('./trips.repo');
const vehiclesRepo = require('../vehicles/vehicles.repo');
const driversRepo = require('../drivers/drivers.repo');

async function list(filters) {
  return tripsRepo.list(filters);
}

async function getById(id) {
  const trip = await tripsRepo.findById(id);
  if (!trip) {
    throw new DomainError('NOT_FOUND', 404, 'Trip not found.');
  }
  return trip;
}

async function create(data, createdBy) {
  // Pre-check vehicle/driver exist and cargo fits capacity for a friendly error
  // before the INSERT (DB trigger is the unbypassable last line of defense).
  const vehicle = await vehiclesRepo.findById(data.vehicle_id);
  if (!vehicle) {
    throw new DomainError('NOT_FOUND', 404, 'Vehicle not found.', 'vehicle_id');
  }
  const driver = await driversRepo.findById(data.driver_id);
  if (!driver) {
    throw new DomainError('NOT_FOUND', 404, 'Driver not found.', 'driver_id');
  }
  if (Number(data.cargo_weight_kg) > Number(vehicle.max_load_capacity_kg)) {
    throw new DomainError(
      'CARGO_EXCEEDS_CAPACITY',
      422,
      `Cargo (${data.cargo_weight_kg} kg) exceeds ${vehicle.name}'s capacity of ${vehicle.max_load_capacity_kg} kg.`,
      'cargo_weight_kg'
    );
  }
  return tripsRepo.create(data, createdBy);
}

async function dispatchTrip(id) {
  return withTransaction(async (client) => {
    const trip = await tripsRepo.findRawById(id, client);
    if (!trip) {
      throw new DomainError('NOT_FOUND', 404, 'Trip not found.');
    }
    if (trip.status !== 'draft') {
      throw new DomainError('TRIP_NOT_DRAFT', 409, 'Only draft trips can be dispatched.');
    }

    const vehicle = await vehiclesRepo.lockById(trip.vehicle_id, client);
    const driver = await driversRepo.lockById(trip.driver_id, client);

    if (vehicle.status !== 'available') {
      throw new DomainError(
        'VEHICLE_UNAVAILABLE',
        409,
        `${vehicle.name} is ${vehicle.status === 'in_shop' ? 'In Shop' : vehicle.status}.`
      );
    }
    if (driver.status !== 'available') {
      throw new DomainError(
        'DRIVER_UNAVAILABLE',
        409,
        `${driver.full_name} is not available (${driver.status}).`
      );
    }
    if (new Date(driver.license_expiry) < new Date()) {
      throw new DomainError(
        'LICENSE_EXPIRED',
        422,
        `${driver.full_name}'s license expired on ${new Date(driver.license_expiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}.`
      );
    }
    if (Number(trip.cargo_weight_kg) > Number(vehicle.max_load_capacity_kg)) {
      throw new DomainError(
        'CARGO_EXCEEDS_CAPACITY',
        422,
        `Cargo (${trip.cargo_weight_kg} kg) exceeds ${vehicle.name}'s capacity of ${vehicle.max_load_capacity_kg} kg.`
      );
    }

    const updatedTrip = await tripsRepo.dispatch(id, vehicle.odometer_km, client);
    await vehiclesRepo.setStatus(trip.vehicle_id, 'on_trip', client);
    await driversRepo.setStatus(trip.driver_id, 'on_trip', client);
    return updatedTrip;
  });
}

async function completeTrip(id, payload) {
  return withTransaction(async (client) => {
    const trip = await tripsRepo.findRawById(id, client);
    if (!trip) {
      throw new DomainError('NOT_FOUND', 404, 'Trip not found.');
    }
    if (trip.status !== 'dispatched') {
      throw new DomainError('TRIP_NOT_DISPATCHED', 409, 'Only dispatched trips can be completed.');
    }
    if (Number(payload.end_odometer_km) <= Number(trip.start_odometer_km)) {
      throw new DomainError(
        'ODOMETER_BACKWARD',
        400,
        `End reading must be greater than ${trip.start_odometer_km} km.`,
        'end_odometer_km'
      );
    }

    const updatedTrip = await tripsRepo.complete(id, payload, client);
    await vehiclesRepo.setStatusAndOdometer(trip.vehicle_id, 'available', payload.end_odometer_km, client);
    await driversRepo.setStatus(trip.driver_id, 'available', client);
    await client.query(
      `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, recorded_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [trip.vehicle_id, trip.id, payload.fuel_consumed_l, payload.fuel_cost, trip.created_by]
    );
    return updatedTrip;
  });
}

async function cancelTrip(id) {
  return withTransaction(async (client) => {
    const trip = await tripsRepo.findRawById(id, client);
    if (!trip) {
      throw new DomainError('NOT_FOUND', 404, 'Trip not found.');
    }
    if (trip.status === 'completed' || trip.status === 'cancelled') {
      throw new DomainError('TRIP_ALREADY_CLOSED', 409, 'Completed trips cannot be cancelled.');
    }

    const wasDispatched = trip.status === 'dispatched';
    const updatedTrip = await tripsRepo.cancel(id, client);
    if (wasDispatched) {
      await vehiclesRepo.setStatus(trip.vehicle_id, 'available', client);
      await driversRepo.setStatus(trip.driver_id, 'available', client);
    }
    return updatedTrip;
  });
}

module.exports = { list, getById, create, dispatchTrip, completeTrip, cancelTrip };
