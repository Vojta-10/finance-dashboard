export type CategoryType = 'Expense' | 'Income';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
}
