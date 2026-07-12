const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const { loginAs, ApiClient } = require('./helpers/client');

let manager, dispatcher, safety, finance, anon;
let seed = {};

before(async () => {
  manager = await loginAs('manager@transitops.in');
  dispatcher = await loginAs('dispatch@transitops.in');
  safety = await loginAs('safety@transitops.in');
  finance = await loginAs('finance@transitops.in');
  anon = new ApiClient();

  const vRes = await manager.get('/api/vehicles');
  const vehicles = vRes.body.vehicles;
  seed.van05 = vehicles.find((v) => v.registration_number === 'MH-12-AB-1234');
  seed.onTripVehicle = vehicles.find((v) => v.registration_number === 'MH-12-AB-2004');
  seed.inShopVehicle = vehicles.find((v) => v.registration_number === 'MH-12-AB-2005');
  seed.retiredVehicle = vehicles.find((v) => v.registration_number === 'MH-12-AB-1999');
  seed.freeVehicle = vehicles.find((v) => v.registration_number === 'MH-12-AB-2001');

  const dRes = await manager.get('/api/drivers');
  const drivers = dRes.body.drivers;
  seed.alex = drivers.find((d) => d.license_number === 'DL-MH-0120260001234');
  seed.onTripDriver = drivers.find((d) => d.license_number === 'DL-MH-0120260004567');
  seed.expiredDriver = drivers.find((d) => d.license_number === 'DL-MH-0120260005678');
  seed.suspendedDriver = drivers.find((d) => d.license_number === 'DL-MH-0120260006789');
  seed.freeDriver2 = drivers.find((d) => d.license_number === 'DL-MH-0120260002345');
});

// ── AUTH ──────────────────────────────────────────────────────────────────
test('auth: login rejects bad email format', async () => {
  const res = await anon.post('/api/auth/login', { email: 'not-an-email', password: 'x' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');
});

test('auth: login rejects wrong password', async () => {
  const res = await anon.post('/api/auth/login', { email: 'manager@transitops.in', password: 'wrong' });
  assert.equal(res.status, 401);
  assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');
});

test('auth: login succeeds and /me returns user', async () => {
  const client = new ApiClient();
  const login = await client.post('/api/auth/login', { email: 'manager@transitops.in', password: 'Demo@1234' });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.role_name, 'fleet_manager');
  const me = await client.get('/api/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, 'manager@transitops.in');
});

test('auth: /me without cookie is 401', async () => {
  const res = await anon.get('/api/auth/me');
  assert.equal(res.status, 401);
});

test('auth: logout clears session', async () => {
  const client = new ApiClient();
  await client.post('/api/auth/login', { email: 'manager@transitops.in', password: 'Demo@1234' });
  const logout = await client.post('/api/auth/logout');
  assert.equal(logout.status, 204);
  const me = await client.get('/api/auth/me');
  assert.equal(me.status, 401);
});

// ── VEHICLES ──────────────────────────────────────────────────────────────
test('vehicles: list visible to all roles', async () => {
  const res = await finance.get('/api/vehicles');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.vehicles));
});

test('vehicles: available endpoint forbidden for finance', async () => {
  const res = await finance.get('/api/vehicles/available');
  assert.equal(res.status, 403);
  assert.equal(res.body.error.code, 'FORBIDDEN');
});

test('vehicles: available endpoint excludes retired/in_shop/on_trip', async () => {
  const res = await dispatcher.get('/api/vehicles/available');
  assert.equal(res.status, 200);
  const regs = res.body.vehicles.map((v) => v.registration_number);
  assert.ok(!regs.includes('MH-12-AB-1999')); // retired
  assert.ok(!regs.includes('MH-12-AB-2005')); // in_shop
  assert.ok(!regs.includes('MH-12-AB-2004')); // on_trip
  assert.ok(regs.includes('MH-12-AB-1234')); // Van-05 available
});

test('vehicles: create rejected for non fleet_manager', async () => {
  const res = await dispatcher.post('/api/vehicles', {
    registration_number: 'MH-TEST-0001', name: 'X', vehicle_type: 'van',
    max_load_capacity_kg: 100, acquisition_cost: 1000,
  });
  assert.equal(res.status, 403);
});

test('vehicles: create validation error on bad capacity', async () => {
  const res = await manager.post('/api/vehicles', {
    registration_number: 'MH-TEST-0002', name: 'BadCap', vehicle_type: 'van',
    max_load_capacity_kg: -5, acquisition_cost: 1000,
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');
});

test('vehicles: create succeeds then duplicate registration is 409', async () => {
  const payload = {
    registration_number: 'MH-TEST-0003', name: 'Fresh Van', vehicle_type: 'van',
    max_load_capacity_kg: 600, acquisition_cost: 500000,
  };
  const created = await manager.post('/api/vehicles', payload);
  assert.equal(created.status, 201);
  assert.equal(created.body.vehicle.status, 'available');

  const dup = await manager.post('/api/vehicles', payload);
  assert.equal(dup.status, 409);
  assert.equal(dup.body.error.code, 'DUPLICATE_REGISTRATION');

  seed.freshVehicle = created.body.vehicle;
});

test('vehicles: patch update works', async () => {
  const res = await manager.patch(`/api/vehicles/${seed.freshVehicle.id}`, { name: 'Renamed Van' });
  assert.equal(res.status, 200);
  assert.equal(res.body.vehicle.name, 'Renamed Van');
});

test('vehicles: retire blocked while on_trip', async () => {
  const res = await manager.post(`/api/vehicles/${seed.onTripVehicle.id}/retire`);
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, 'VEHICLE_ON_TRIP');
});

test('vehicles: retire succeeds on available vehicle', async () => {
  const res = await manager.post(`/api/vehicles/${seed.freshVehicle.id}/retire`);
  assert.equal(res.status, 200);
  assert.equal(res.body.vehicle.status, 'retired');
});

test('vehicles: 404 on unknown id', async () => {
  const res = await manager.get('/api/vehicles/999999');
  assert.equal(res.status, 404);
});

// ── DRIVERS ───────────────────────────────────────────────────────────────
test('drivers: list visible to all', async () => {
  const res = await dispatcher.get('/api/drivers');
  assert.equal(res.status, 200);
  assert.ok(res.body.drivers.length >= 6);
});

test('drivers: available excludes suspended, off_duty, on_trip, expired', async () => {
  const res = await dispatcher.get('/api/drivers/available');
  assert.equal(res.status, 200);
  const licenses = res.body.drivers.map((d) => d.license_number);
  assert.ok(!licenses.includes('DL-MH-0120260006789')); // suspended
  assert.ok(!licenses.includes('DL-MH-0120260004567')); // on_trip
  assert.ok(!licenses.includes('DL-MH-0120260005678')); // expired
  assert.ok(licenses.includes('DL-MH-0120260001234')); // Alex
});

test('drivers: create rejected for dispatcher role', async () => {
  const res = await dispatcher.post('/api/drivers', {
    full_name: 'Nope Driver', license_number: 'DL-XYZ-000000', license_category: 'LMV',
    license_expiry: '2028-01-01', contact_number: '+91 9000000000',
  });
  assert.equal(res.status, 403);
});

test('drivers: create validation error on bad phone', async () => {
  const res = await safety.post('/api/drivers', {
    full_name: 'Bad Phone', license_number: 'DL-BADPHONE-01', license_category: 'LMV',
    license_expiry: '2028-01-01', contact_number: '!!',
  });
  assert.equal(res.status, 400);
});

test('drivers: create succeeds then duplicate license is 409', async () => {
  const payload = {
    full_name: 'Fresh Driver', license_number: 'DL-FRESH-000001', license_category: 'LMV',
    license_expiry: '2028-01-01', contact_number: '+91 9000000001',
  };
  const created = await safety.post('/api/drivers', payload);
  assert.equal(created.status, 201);
  seed.freshDriver = created.body.driver;

  const dup = await safety.post('/api/drivers', payload);
  assert.equal(dup.status, 409);
  assert.equal(dup.body.error.code, 'DUPLICATE_LICENSE');
});

test('drivers: suspend blocked while on_trip', async () => {
  const res = await safety.post(`/api/drivers/${seed.onTripDriver.id}/suspend`);
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, 'DRIVER_ON_TRIP');
});

test('drivers: suspend then reinstate works on fresh driver', async () => {
  const suspend = await safety.post(`/api/drivers/${seed.freshDriver.id}/suspend`);
  assert.equal(suspend.status, 200);
  assert.equal(suspend.body.driver.status, 'suspended');

  const reinstate = await safety.post(`/api/drivers/${seed.freshDriver.id}/reinstate`);
  assert.equal(reinstate.status, 200);
  assert.equal(reinstate.body.driver.status, 'available');
});

test('drivers: off-duty then on-duty works', async () => {
  const off = await safety.post(`/api/drivers/${seed.freshDriver.id}/off-duty`);
  assert.equal(off.status, 200);
  assert.equal(off.body.driver.status, 'off_duty');

  const on = await safety.post(`/api/drivers/${seed.freshDriver.id}/on-duty`);
  assert.equal(on.status, 200);
  assert.equal(on.body.driver.status, 'available');
});

// ── TRIPS ─────────────────────────────────────────────────────────────────
test('trips: create rejected for financial_analyst role', async () => {
  const res = await finance.post('/api/trips', {
    source: 'Pune', destination: 'Mumbai', vehicle_id: seed.van05.id,
    driver_id: seed.alex.id, cargo_weight_kg: 100, planned_distance_km: 150,
  });
  assert.equal(res.status, 403);
});

test('trips: create rejects same source/destination', async () => {
  const res = await dispatcher.post('/api/trips', {
    source: 'Pune', destination: 'Pune', vehicle_id: seed.van05.id,
    driver_id: seed.alex.id, cargo_weight_kg: 100, planned_distance_km: 150,
  });
  assert.equal(res.status, 400);
});

test('trips: create rejects cargo exceeding capacity', async () => {
  const res = await dispatcher.post('/api/trips', {
    source: 'Pune', destination: 'Mumbai', vehicle_id: seed.van05.id,
    driver_id: seed.alex.id, cargo_weight_kg: 650, planned_distance_km: 150,
  });
  assert.equal(res.status, 422);
  assert.equal(res.body.error.code, 'CARGO_EXCEEDS_CAPACITY');
});

test('trips: full lifecycle draft -> dispatch -> complete', async () => {
  const create = await dispatcher.post('/api/trips', {
    source: 'Pune', destination: 'Mumbai', vehicle_id: seed.van05.id,
    driver_id: seed.alex.id, cargo_weight_kg: 450, planned_distance_km: 150, revenue: 5000,
  });
  assert.equal(create.status, 201);
  assert.equal(create.body.trip.status, 'draft');
  const tripId = create.body.trip.id;

  const dispatchRes = await dispatcher.post(`/api/trips/${tripId}/dispatch`);
  assert.equal(dispatchRes.status, 200);
  assert.equal(dispatchRes.body.trip.status, 'dispatched');

  const vehicleCheck = await manager.get(`/api/vehicles/${seed.van05.id}`);
  assert.equal(vehicleCheck.body.vehicle.status, 'on_trip');
  const driverCheck = await manager.get(`/api/drivers/${seed.alex.id}`);
  assert.equal(driverCheck.body.driver.status, 'on_trip');

  const startOdo = Number(dispatchRes.body.trip.start_odometer_km);
  const complete = await dispatcher.post(`/api/trips/${tripId}/complete`, {
    end_odometer_km: startOdo + 150, fuel_consumed_l: 12, fuel_cost: 1200,
  });
  assert.equal(complete.status, 200);
  assert.equal(complete.body.trip.status, 'completed');

  const vehicleAfter = await manager.get(`/api/vehicles/${seed.van05.id}`);
  assert.equal(vehicleAfter.body.vehicle.status, 'available');
  const driverAfter = await manager.get(`/api/drivers/${seed.alex.id}`);
  assert.equal(driverAfter.body.driver.status, 'available');

  seed.completedTripId = tripId;
});

test('trips: dispatch fails for vehicle already in_shop', async () => {
  const create = await dispatcher.post('/api/trips', {
    source: 'Pune', destination: 'Nashik', vehicle_id: seed.inShopVehicle.id,
    driver_id: seed.freeDriver2.id, cargo_weight_kg: 1000, planned_distance_km: 100,
  });
  assert.equal(create.status, 201);
  const dispatchRes = await dispatcher.post(`/api/trips/${create.body.trip.id}/dispatch`);
  assert.equal(dispatchRes.status, 409);
  assert.equal(dispatchRes.body.error.code, 'VEHICLE_UNAVAILABLE');
});

test('trips: dispatch fails for expired license driver', async () => {
  const create = await dispatcher.post('/api/trips', {
    source: 'Pune', destination: 'Nashik', vehicle_id: seed.freeVehicle.id,
    driver_id: seed.expiredDriver.id, cargo_weight_kg: 1000, planned_distance_km: 100,
  });
  assert.equal(create.status, 201);
  const dispatchRes = await dispatcher.post(`/api/trips/${create.body.trip.id}/dispatch`);
  assert.equal(dispatchRes.status, 422);
  assert.equal(dispatchRes.body.error.code, 'LICENSE_EXPIRED');
});

test('trips: complete fails with backward odometer', async () => {
  const create = await dispatcher.post('/api/trips', {
    source: 'Pune', destination: 'Nashik', vehicle_id: seed.freeVehicle.id,
    driver_id: seed.freeDriver2.id, cargo_weight_kg: 1000, planned_distance_km: 100,
  });
  const tripId = create.body.trip.id;
  const dispatchRes = await dispatcher.post(`/api/trips/${tripId}/dispatch`);
  assert.equal(dispatchRes.status, 200);
  const startOdo = Number(dispatchRes.body.trip.start_odometer_km);

  const complete = await dispatcher.post(`/api/trips/${tripId}/complete`, {
    end_odometer_km: startOdo - 10, fuel_consumed_l: 5, fuel_cost: 500,
  });
  assert.equal(complete.status, 400);
  assert.equal(complete.body.error.code, 'ODOMETER_BACKWARD');

  const cancel = await dispatcher.post(`/api/trips/${tripId}/cancel`);
  assert.equal(cancel.status, 200);
  assert.equal(cancel.body.trip.status, 'cancelled');
});

test('trips: cancel on completed trip is rejected', async () => {
  const res = await dispatcher.post(`/api/trips/${seed.completedTripId}/cancel`);
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, 'TRIP_ALREADY_CLOSED');
});

test('trips: list and filter by status', async () => {
  const res = await manager.get('/api/trips?status=completed');
  assert.equal(res.status, 200);
  assert.ok(res.body.trips.every((t) => t.status === 'completed'));
});

// ── MAINTENANCE ───────────────────────────────────────────────────────────
test('maintenance: open blocked on retired vehicle', async () => {
  const res = await manager.post('/api/maintenance', {
    vehicle_id: seed.retiredVehicle.id, title: 'Should fail',
  });
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, 'VEHICLE_RETIRED');
});

test('maintenance: open blocked when already open', async () => {
  const res = await manager.post('/api/maintenance', {
    vehicle_id: seed.inShopVehicle.id, title: 'Duplicate open job',
  });
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, 'MAINTENANCE_ALREADY_OPEN');
});

test('maintenance: open then close cycle', async () => {
  const open = await manager.post('/api/maintenance', {
    vehicle_id: seed.freeVehicle.id, title: 'Routine Service',
  });
  assert.equal(open.status, 201);
  assert.equal(open.body.maintenance_log.status, 'open');

  const vehicleCheck = await manager.get(`/api/vehicles/${seed.freeVehicle.id}`);
  assert.equal(vehicleCheck.body.vehicle.status, 'in_shop');

  const close = await manager.post(`/api/maintenance/${open.body.maintenance_log.id}/close`, { cost: 1500 });
  assert.equal(close.status, 200);
  assert.equal(close.body.maintenance_log.status, 'closed');

  const vehicleAfter = await manager.get(`/api/vehicles/${seed.freeVehicle.id}`);
  assert.equal(vehicleAfter.body.vehicle.status, 'available');

  const reclose = await manager.post(`/api/maintenance/${open.body.maintenance_log.id}/close`, { cost: 100 });
  assert.equal(reclose.status, 409);
  assert.equal(reclose.body.error.code, 'ALREADY_CLOSED');
});

test('maintenance: dispatcher can view per RBAC matrix', async () => {
  const res = await dispatcher.get('/api/maintenance');
  assert.equal(res.status, 200);
});

test('maintenance: safety officer cannot view', async () => {
  const res = await safety.get('/api/maintenance');
  assert.equal(res.status, 403);
});

// ── FUEL LOGS ─────────────────────────────────────────────────────────────
test('fuel-logs: dispatcher can view per RBAC matrix', async () => {
  const res = await dispatcher.get('/api/fuel-logs');
  assert.equal(res.status, 200);
});

test('fuel-logs: safety officer cannot view', async () => {
  const res = await safety.get('/api/fuel-logs');
  assert.equal(res.status, 403);
});

test('fuel-logs: dispatcher cannot create', async () => {
  const res = await dispatcher.post('/api/fuel-logs', {
    vehicle_id: seed.van05.id, liters: 10, cost: 1000,
  });
  assert.equal(res.status, 403);
});

test('fuel-logs: create validation error on non-positive liters', async () => {
  const res = await finance.post('/api/fuel-logs', {
    vehicle_id: seed.van05.id, liters: 0, cost: 100,
  });
  assert.equal(res.status, 400);
});

test('fuel-logs: create succeeds', async () => {
  const res = await finance.post('/api/fuel-logs', {
    vehicle_id: seed.van05.id, liters: 10, cost: 1000,
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.fuel_log.vehicle_id, String(seed.van05.id));
});

// ── EXPENSES ──────────────────────────────────────────────────────────────
test('expenses: dispatcher forbidden from viewing', async () => {
  const res = await dispatcher.get('/api/expenses');
  assert.equal(res.status, 403);
});

test('expenses: create validation error on non-positive amount', async () => {
  const res = await finance.post('/api/expenses', {
    vehicle_id: seed.van05.id, category: 'toll', amount: -5,
  });
  assert.equal(res.status, 400);
});

test('expenses: create succeeds', async () => {
  const res = await finance.post('/api/expenses', {
    vehicle_id: seed.van05.id, category: 'toll', amount: 200,
  });
  assert.equal(res.status, 201);
});

// ── DASHBOARD ─────────────────────────────────────────────────────────────
test('dashboard: kpis accessible to all roles', async () => {
  const res = await dispatcher.get('/api/dashboard/kpis');
  assert.equal(res.status, 200);
  assert.ok('active_vehicles' in res.body.kpis);
  assert.ok('fleet_utilization_pct' in res.body.kpis);
});

test('dashboard: kpis with filters', async () => {
  const res = await manager.get('/api/dashboard/kpis?type=truck&region=central');
  assert.equal(res.status, 200);
  assert.ok('active_vehicles' in res.body.kpis);
});

// ── REPORTS ───────────────────────────────────────────────────────────────
test('reports: vehicle analytics forbidden for dispatcher', async () => {
  const res = await dispatcher.get('/api/reports/vehicles');
  assert.equal(res.status, 403);
});

test('reports: vehicle analytics accessible to finance', async () => {
  const res = await finance.get('/api/reports/vehicles');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.vehicles));
  assert.ok('roi' in res.body.vehicles[0]);
});

test('reports: csv export returns csv content', async () => {
  const res = await manager.get('/api/reports/vehicles.csv');
  assert.equal(res.status, 200);
  assert.ok(typeof res.body === 'string');
  assert.ok(res.body.startsWith('id,registration_number'));
});

test('reports: license alerts accessible to safety officer', async () => {
  const res = await safety.get('/api/reports/license-alerts');
  assert.equal(res.status, 200);
  assert.ok(res.body.alerts.some((a) => a.alert === 'expired'));
});

test('reports: license alerts forbidden for finance', async () => {
  const res = await finance.get('/api/reports/license-alerts');
  assert.equal(res.status, 403);
});

// ── 404 / unauthenticated sanity ─────────────────────────────────────────
test('unknown route returns 404 envelope', async () => {
  const res = await manager.get('/api/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal(res.body.error.code, 'NOT_FOUND');
});

test('protected route without auth returns 401', async () => {
  const res = await anon.get('/api/trips');
  assert.equal(res.status, 401);
  assert.equal(res.body.error.code, 'UNAUTHENTICATED');
});
