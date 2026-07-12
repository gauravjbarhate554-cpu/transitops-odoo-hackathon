const { z } = require('zod');

const EXPENSE_CATEGORIES = ['toll', 'parking', 'repair', 'insurance', 'other'];

const createExpenseSchema = z.object({
  vehicle_id: z.coerce.number().int().positive('Choose a vehicle.'),
  trip_id: z.coerce.number().int().positive().optional().nullable(),
  category: z.enum(EXPENSE_CATEGORIES, { errorMap: () => ({ message: 'Choose a category.' }) }),
  amount: z.coerce.number().positive('Amount must be greater than 0.'),
  description: z.string().optional(),
  expense_date: z.coerce
    .date()
    .refine((d) => d <= new Date(), { message: 'Date cannot be in the future.' })
    .optional(),
});

module.exports = { EXPENSE_CATEGORIES, createExpenseSchema };
