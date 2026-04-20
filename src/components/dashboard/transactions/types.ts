export type ChipColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

export interface Transaction {
  id: number;
  date: string;
  note: string;
  categories: {
    name: string;
    color: ChipColor;
    id: number;
  };
  amount: string;
}
