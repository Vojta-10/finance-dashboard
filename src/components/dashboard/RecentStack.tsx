import { Card, Typography, Box } from '@mui/material';
import Stack from '@mui/material/Stack';

const dummyTransactions = [
  { id: 1, title: 'Grocery Store', date: 'Oct 12, 2023', amount: '-$45.00' },
  { id: 2, title: 'Salary Deposit', date: 'Oct 10, 2023', amount: '+$3,200.00' },
  { id: 3, title: 'Electric Bill', date: 'Oct 08, 2023', amount: '-$120.00' },
  { id: 4, title: 'Coffee Shop', date: 'Oct 08, 2023', amount: '-$4.50' },
  { id: 5, title: 'Internet Service', date: 'Oct 05, 2023', amount: '-$75.00' },
];

export default function RecentStack() {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant='h6' gutterBottom>
        Recent Transactions
      </Typography>

      <Stack sx={{ mt: 2 }}>
        {dummyTransactions.map((transaction) => (
          <Box
            key={transaction.id}
            sx={{
              p: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant='body1' sx={{ fontWeight: 500 }}>
                {transaction.title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {transaction.date}
              </Typography>
            </Box>

            {/* Right Side: Amount */}
            <Typography
              variant='body1'
              sx={{
                fontWeight: 'bold',
                color: transaction.amount.startsWith('+')
                  ? 'success.main'
                  : 'error.main',
              }}
            >
              {transaction.amount}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
