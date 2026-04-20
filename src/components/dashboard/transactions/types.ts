export interface Transaction {
  id: number;
  date: string;
  note: string;
  category_id: string;
  categories: {
    name: string;
    color: string;
  };
  amount: string;
}
