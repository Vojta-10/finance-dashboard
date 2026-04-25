import { useData } from '@/context/DataContent';
import { Card, Typography, Box, Chip } from '@mui/material';
import Stack from '@mui/material/Stack';
import { formatCurrency } from '@/utils/utils';

export default function RecentStack() {
  const { transactions } = useData();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card sx={{ p: { xs: 1.5, sm: 3 }, minWidth: 0, overflow: 'hidden' }}>
      <Typography variant='h6' gutterBottom>
        Recent Transactions
      </Typography>

      {recentTransactions.length === 0 ? (
        <Typography variant='body1' color='text.secondary' textAlign='center'>
          No transactions yet. Start adding some!
        </Typography>
      ) : (
        <Stack sx={{ mt: { xs: 1.5, md: 2 }, gap: { xs: 1, md: 1.25 } }}>
          {recentTransactions.map((transaction) => (
            <Box
              key={transaction.id}
              sx={{
                p: { xs: 1.5, md: 2 },
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant='body1' noWrap sx={{ fontWeight: 500 }}>
                  {transaction.note || 'No description'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {transaction.date.toString().split('T')[0]}
                </Typography>

                <Chip
                  label={transaction.categories?.name}
                  variant='outlined'
                  sx={{
                    display: { xs: 'inline-flex', sm: 'none' },
                    mt: 1,
                    color: transaction.categories?.color,
                    fontWeight: 'bold',
                    borderColor: transaction.categories?.color,
                    maxWidth: '100%',
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: { xs: 'none', sm: 'flex' },
                  justifyContent: 'flex-start',
                  px: 1,
                }}
              >
                <Chip
                  label={transaction.categories?.name}
                  variant='outlined'
                  sx={{
                    color: transaction.categories?.color,
                    fontWeight: 'bold',
                    borderColor: transaction.categories?.color,
                  }}
                />
              </Box>

              {/* Right Side: Amount */}
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  color:
                    transaction.categories.type === 'Income'
                      ? 'success.main'
                      : 'error.main',
                }}
              >
                {formatCurrency(Number(transaction.amount))}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Card>
  );
}
