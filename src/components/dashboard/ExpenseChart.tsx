'use client'; // Charts require client-side JavaScript to render interactivity (like tooltips!)

import { Card, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

// 1. Setup our dummy expense data
const expenseData = [
  { id: 0, value: 1200, label: 'Housing' },
  { id: 1, value: 400, label: 'Groceries' },
  { id: 2, value: 300, label: 'Transport' },
  { id: 3, value: 150, label: 'Entertainment' },
  { id: 4, value: 200, label: 'Utilities' },
];

export default function ExpenseChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Adjusts chart layout for smaller screens
  return (
    <Card
      sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant='h6' gutterBottom>
        Expenses by Category
      </Typography>

      {/* Box container helps center the chart and control its sizing */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PieChart
          series={[
            {
              data: expenseData,
              innerRadius: isMobile ? 35 : 45, // Makes it a "Donut" chart instead of a solid pie!
              cornerRadius: 5, // Rounds the edges of the slices
              outerRadius: isMobile ? 100 : 120, // Controls how big the pie chart is
              paddingAngle: 2, // Adds space between slices for better readability
            },
          ]}
          height={300}
          margin={{ top: 10, bottom: 10, left: isMobile ? 0 : 10, right: isMobile ? 0 : 10 }}
          hideLegend
        />
      </Box>
    </Card>
  );
}
