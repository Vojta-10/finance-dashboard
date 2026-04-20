import * as z from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['Expense', 'Income']),
  date: z.union([
    z.string().min(1, 'Date is required'),
    z.date({ message: 'Date is required' }),
  ]),
  description: z
    .string()
    .min(2, 'Description must be at least 2 characters')
    .max(50, 'Description must be 50 characters or fewer'),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().gt(0, 'Amount must be greater than 0'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
