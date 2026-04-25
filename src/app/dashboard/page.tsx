'use client';

import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import SummaryCard from '@/components/dashboard/SummaryCard';
import RecentStack from '@/components/dashboard/RecentStack';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import { useData } from '@/context/DataContent';
import { formatCurrency } from '@/utils/utils';

export default function DashboardPage() {
  const { transactions, isLoading } = useData();

  if (isLoading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );

  const totalIncome = transactions
    .filter((tx) => tx.categories.type === 'Income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpense = transactions
    .filter((tx) => tx.categories.type === 'Expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

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
    <Box>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2rem' },
          mb: { xs: 2, md: 3 },
        }}
      >
        Dashboard
      </Typography>

      <Grid
        container
        spacing={{ xs: 1.5, md: 3 }}
        rowSpacing={{ xs: 2, md: 4 }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title='Total Balance'
            amount={formatCurrency(balance)}
            type='balance'
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title='Monthly Income'
            amount={formatCurrency(monthlyIncome)}
            type='income'
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title='Monthly Expenses'
            amount={formatCurrency(Math.abs(monthlyExpense))}
            type='expense'
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 4 }}>
          <ExpenseChart></ExpenseChart>
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 8 }}>
          <IncomeExpenseChart></IncomeExpenseChart>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <RecentStack></RecentStack>
        </Grid>
      </Grid>
    </Box>
  );
}
