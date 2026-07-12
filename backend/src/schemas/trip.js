const { z } = require('zod');

const createTripSchema = z
  .object({
    source: z.string().min(1, 'Source is required.'),
    destination: z.string().min(1, 'Destination is required.'),
    vehicle_id: z.coerce.number().int().positive('Choose a vehicle.'),
    driver_id: z.coerce.number().int().positive('Choose a driver.'),
    cargo_weight_kg: z.coerce.number().positive('Cargo weight must be greater than 0.'),
    planned_distance_km: z.coerce.number().positive('Planned distance must be greater than 0 km.'),
    revenue: z.coerce.number().nonnegative('Revenue cannot be negative.').optional(),
  })
  .refine((data) => data.source !== data.destination, {
    message: 'Source and destination cannot be the same.',
    path: ['destination'],
  });

const completeTripSchema = z.object({
  end_odometer_km: z.coerce.number().positive('End odometer reading must be greater than 0.'),
  fuel_consumed_l: z.coerce.number().positive('Liters must be greater than 0.'),
  fuel_cost: z.coerce.number().nonnegative('Fuel cost cannot be negative.'),
});

const cancelTripSchema = z.object({
  reason: z.string().optional(),
});

const tripQuerySchema = z.object({
  status: z.enum(['draft', 'dispatched', 'completed', 'cancelled']).optional(),
});

module.exports = {
  createTripSchema,
  completeTripSchema,
  cancelTripSchema,
  tripQuerySchema,
};
