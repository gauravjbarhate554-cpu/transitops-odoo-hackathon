const { z } = require('zod');

const createMaintenanceSchema = z.object({
  vehicle_id: z.coerce.number().int().positive('Choose a vehicle.'),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
});

const closeMaintenanceSchema = z.object({
  cost: z.coerce.number().nonnegative('Cost cannot be negative.'),
});

const maintenanceQuerySchema = z.object({
  status: z.enum(['open', 'closed']).optional(),
});

module.exports = {
  createMaintenanceSchema,
  closeMaintenanceSchema,
  maintenanceQuerySchema,
};
