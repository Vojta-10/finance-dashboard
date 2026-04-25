'use client'; // Charts require client-side JavaScript to render interactivity (like tooltips!)

import { useData } from '@/context/DataContent';
import { Card, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

export default function ExpenseChart() {
  const { transactions } = useData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Adjusts chart layout for smaller screens
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const expenses = transactions.filter(
    (tx) => tx.categories.type === 'Expense',
  );

  const categoryTotals = expenses.reduce(
    (acc, tx) => {
      const categoryName = tx.categories?.name || 'Uncategorized';
      const categoryColor = tx.categories?.color || '#cccccc';

      if (!acc[categoryName]) {
        acc[categoryName] = { amount: 0, color: categoryColor };
      }

      acc[categoryName].amount += Math.abs(Number(tx.amount));
      return acc;
    },
    {} as Record<string, { amount: number; color: string }>,
  );

  const expenseData = Object.entries(categoryTotals).map(
    ([name, data], index) => ({
      id: index,
      value: data.amount,
      label: name,
      color: data.color,
    }),
  );

  const getOuterRadius = () => {
    if (isMobile) return 90;
    if (isTablet) return 130;
    return 120; // Desktop
  };

  const getInnerRadius = () => {
    if (isMobile) return 30;
    if (isTablet) return 40;
    return 45; // Desktop
  };
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
        Expenses by Category
      </Typography>

      {/* Box container helps center the chart and control its sizing */}
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
        {expenseData.length === 0 ? (
          <Typography variant='body1' color='textSecondary'>
            No expense data available.
          </Typography>
        ) : (
          <PieChart
            series={[
              {
                data: expenseData,
                innerRadius: getInnerRadius(),
                cornerRadius: 5, // Rounds the edges of the slices
                outerRadius: getOuterRadius(), // Controls how big the pie chart is
                paddingAngle: 2, // Adds space between slices for better readability
              },
            ]}
            height={isMobile ? 250 : 300}
            margin={{
              top: 10,
              bottom: 10,
              left: isMobile ? 0 : 10,
              right: isMobile ? 0 : 10,
            }}
            hideLegend
          />
        )}
      </Box>
    </Card>
  );
}
