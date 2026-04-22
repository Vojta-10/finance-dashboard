'use client';

import { CircularProgress, Grid } from '@mui/material';
import SummaryCard from '@/components/dashboard/SummaryCard';
import RecentStack from '@/components/dashboard/RecentStack';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import { useData } from '@/context/DataContent';

export default function DashboardPage() {
  const { transactions, categories, isLoading } = useData();

  if (isLoading) return <CircularProgress />;
  console.log(transactions);

  const totalIncome = transactions
    .filter((tx) => tx.categories.type === 'Income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpense = transactions
    .filter((tx) => tx.categories.type === 'Expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  console.log(totalExpense, totalIncome);
  const balance = totalIncome + totalExpense;

  const monthlyIncome = transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      const now = new Date();
      return (
        tx.categories.type === 'Income' &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const monthlyExpense = transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      const now = new Date();
      return (
        tx.categories.type === 'Expense' &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);


  return (
    <Grid container spacing={3} rowSpacing={5}>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title='Total Balance'
          amount={`$${balance.toFixed(2)}`}
          type='balance'
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title='Monthly Income'
          amount={`$${monthlyIncome.toFixed(2)}`}
          type='income'
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title='Monthly Expenses'
          amount={`$${monthlyExpense.toFixed(2).slice(1)}`}
          type='expense'
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ExpenseChart></ExpenseChart>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <IncomeExpenseChart></IncomeExpenseChart>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <RecentStack></RecentStack>
      </Grid>
    </Grid>
  );
}
