const { z } = require('zod');

const VEHICLE_TYPES = ['truck', 'van', 'mini_truck', 'trailer'];

const createVehicleSchema = z.object({
  registration_number: z.string().min(4, 'Registration number must be at least 4 characters.'),
  name: z.string().min(1, 'Name is required.'),
  model: z.string().optional(),
  vehicle_type: z.enum(VEHICLE_TYPES, { errorMap: () => ({ message: 'Choose a vehicle type.' }) }),
  region: z.string().optional(),
  max_load_capacity_kg: z.number().positive('Capacity must be greater than 0 kg.'),
  odometer_km: z.number().nonnegative('Odometer cannot be negative.').optional(),
  acquisition_cost: z.number().positive('Acquisition cost must be greater than 0.'),
});

const updateVehicleSchema = createVehicleSchema.partial();

const vehicleQuerySchema = z.object({
  type: z.enum(VEHICLE_TYPES).optional(),
  status: z.enum(['available', 'on_trip', 'in_shop', 'retired']).optional(),
  region: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

const availableVehicleQuerySchema = z.object({
  min_capacity: z.coerce.number().positive().optional(),
});

module.exports = {
  VEHICLE_TYPES,
  createVehicleSchema,
  updateVehicleSchema,
  vehicleQuerySchema,
  availableVehicleQuerySchema,
};
