const { z } = require('zod');

const createFuelLogSchema = z.object({
  vehicle_id: z.coerce.number().int().positive('Choose a vehicle.'),
  trip_id: z.coerce.number().int().positive().optional().nullable(),
  liters: z.coerce.number().positive('Liters must be greater than 0.'),
  cost: z.coerce.number().nonnegative('Cost cannot be negative.'),
  log_date: z.coerce
    .date()
    .refine((d) => d <= new Date(), { message: 'Date cannot be in the future.' })
    .optional(),
});

module.exports = { createFuelLogSchema };
