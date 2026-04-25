'use client';

import { useData } from '@/context/DataContent';
import { Card, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts';

export default function IncomeExpenseChart() {
  const { transactions } = useData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Adjusts chart layout for smaller screens
  const chartData = [] as {
    month: number;
    year: number;
    label: string;
    income: number;
    expense: number;
  }[];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    // Go back 'i' months from today
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

    chartData.push({
      // We store month and year to safely match transactions
      month: d.getMonth(),
      year: d.getFullYear(),
      // The display label (e.g., "Jan", "Feb")
      label: d.toString().split(' ')[1],
      income: 0,
      expense: 0,
    });
  }

  transactions.forEach((tx) => {
    // Supabase returns dates as strings, so we convert it
    const txDate = new Date(tx.date);
    const txMonth = txDate.getMonth();
    const txYear = txDate.getFullYear();

    // Find the matching month in our 6-month skeleton
    const targetMonth = chartData.find(
      (data) => data.month === txMonth && data.year === txYear,
    );

    // If it's found (meaning it happened in the last 6 months), add the money!
    if (targetMonth) {
      if (tx.categories.type === 'Income') {
        targetMonth.income += Number(tx.amount);
      } else if (tx.categories.type === 'Expense') {
        targetMonth.expense += Math.abs(Number(tx.amount));
      }
    }
  });

  const xLabels = chartData.map((data) => data.label);
  const incomeData = chartData.map((data) => data.income);
  const expenseData = chartData.map((data) => data.expense);
  const hasData = chartData.some((data) => data.income > 0 || data.expense > 0);
  return (
    <Card
      sx={{
        p: { xs: 1.5, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Typography variant='h6' gutterBottom>
        Income vs. Expenses
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: 300,
          minWidth: 0,
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {!hasData ? (
          <Typography variant='body1' color='text.secondary'>
            No transactions in the last 6 months.
          </Typography>
        ) : (
          <BarChart
            series={[
              { data: incomeData, label: 'Income', color: '#4caf50' },
              { data: expenseData, label: 'Expenses', color: '#ef5350' },
            ]}
            xAxis={[
              {
                scaleType: 'band',
                data: xLabels,
                tickLabelStyle: isMobile ? { fontSize: 10 } : {},
              },
            ]}
            height={isMobile ? 250 : 300}
            margin={{
              top: isMobile ? 40 : 20,
              bottom: 30,
              left: isMobile ? 0 : 40,
              right: 10,
            }}
            hideLegend={isMobile}
          />
        )}
      </Box>
    </Card>
  );
}
