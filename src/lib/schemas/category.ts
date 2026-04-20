import * as z from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(40, 'Category name must be 40 characters or fewer'),
  type: z.enum(['Expense', 'Income']),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
