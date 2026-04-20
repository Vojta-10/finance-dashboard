'use client';

import { Card, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts';

const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const incomeData = [4000, 4200, 4100, 4500, 4200, 4800];
const expenseData = [2800, 3100, 2900, 3500, 3000, 3200];

export default function IncomeExpenseChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Adjusts chart layout for smaller screens

  return (
    <Card
      sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant='h6' gutterBottom>
        Income vs. Expenses
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
      </Box>
    </Card>
  );
}
