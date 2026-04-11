import { Grid } from '@mui/material';
import SummaryCard from '@/components/dashboard/SummaryCard';
import RecentStack from '@/components/dashboard/RecentStack';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';

export default function DashboardPage() {
  return (
    <Grid container spacing={3} rowSpacing={5}>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard title='Total Balance' amount='$10,000' type='balance' />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard title='Monthly Income' amount='$5,000' type='income' />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard title='Monthly Expenses' amount='$2,000' type='expense' />
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
