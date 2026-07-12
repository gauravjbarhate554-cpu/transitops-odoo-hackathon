const { DomainError } = require('../utils/errors');

// Maps a raised Postgres constraint name to a friendly domain error.
// Falls back to a generic message when the constraint isn't one we special-case.
function translatePgError(err) {
  if (err.code === '23505') {
    // unique_violation
    if (err.constraint === 'vehicles_registration_number_key') {
      return new DomainError('DUPLICATE_REGISTRATION', 409, 'This registration number is already registered.', 'registration_number');
    }
    if (err.constraint === 'drivers_license_number_key') {
      return new DomainError('DUPLICATE_LICENSE', 409, 'This license number already exists.', 'license_number');
    }
    if (err.constraint === 'users_email_key') {
      return new DomainError('DUPLICATE_EMAIL', 409, 'This email is already registered.', 'email');
    }
    if (err.constraint === 'uq_active_trip_per_vehicle') {
      return new DomainError('VEHICLE_UNAVAILABLE', 409, 'This vehicle is already on an active trip.');
    }
    if (err.constraint === 'uq_active_trip_per_driver') {
      return new DomainError('DRIVER_UNAVAILABLE', 409, 'This driver is already on an active trip.');
    }
    if (err.constraint === 'uq_open_maintenance_per_vehicle') {
      return new DomainError('MAINTENANCE_ALREADY_OPEN', 409, 'This vehicle already has an open maintenance job.');
    }
    return new DomainError('DUPLICATE_ENTRY', 409, 'This record already exists.');
  }
  if (err.code === '23514') {
    // check_violation
    if (err.message && err.message.includes('CARGO_EXCEEDS_CAPACITY')) {
      return new DomainError('CARGO_EXCEEDS_CAPACITY', 422, 'Cargo weight exceeds this vehicle\'s capacity.', 'cargo_weight_kg');
    }
    return new DomainError('CHECK_VIOLATION', 422, 'The submitted data violates a business rule.');
  }
  if (err.code === '23503') {
    // foreign_key_violation
    return new DomainError('INVALID_REFERENCE', 400, 'One of the referenced records does not exist.');
  }
  return null;
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof DomainError) {
    return res.status(err.httpStatus).json({
      error: { code: err.code, message: err.message, field: err.field },
    });
  }

  if (err.code) {
    const translated = translatePgError(err);
    if (translated) {
      return res.status(translated.httpStatus).json({
        error: { code: translated.code, message: translated.message, field: translated.field },
      });
    }
  }

  console.error(err);
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
  });
}

module.exports = { errorHandler, notFoundHandler, translatePgError };
