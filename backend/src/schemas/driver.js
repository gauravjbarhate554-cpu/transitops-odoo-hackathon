const { z } = require('zod');

const LICENSE_CATEGORIES = ['LMV', 'HMV', 'TRANS'];
const phoneRegex = /^[0-9+][0-9 -]{6,14}$/;

const createDriverSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters.'),
  license_number: z.string().min(5, 'License number must be at least 5 characters.'),
  license_category: z.enum(LICENSE_CATEGORIES, { errorMap: () => ({ message: 'Choose a license category.' }) }),
  license_expiry: z.coerce.date({ errorMap: () => ({ message: 'Enter a valid license expiry date.' }) }),
  contact_number: z.string().regex(phoneRegex, 'Enter a valid contact number (7-15 digits).'),
  safety_score: z.number().int().min(0).max(100, 'Safety score must be between 0 and 100.').optional(),
});

const updateDriverSchema = createDriverSchema.partial();

const driverQuerySchema = z.object({
  status: z.enum(['available', 'on_trip', 'off_duty', 'suspended']).optional(),
  search: z.string().optional(),
});

module.exports = {
  LICENSE_CATEGORIES,
  createDriverSchema,
  updateDriverSchema,
  driverQuerySchema,
};
