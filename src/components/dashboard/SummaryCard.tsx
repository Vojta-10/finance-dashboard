import { Card, CardContent, Typography, Box } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface SummaryCardProps {
  title: string;
  amount: string;
  type: 'balance' | 'income' | 'expense';
}

export default function SummaryCard({ title, amount, type }: SummaryCardProps) {
  const getCardStyles = () => {
    switch (type) {
      case 'income':
        return { icon: <TrendingUpIcon />, color: 'success.main' };
      case 'expense':
        return { icon: <TrendingDownIcon />, color: 'error.main' };
      default:
        return { icon: <AccountBalanceWalletIcon />, color: 'primary.main' };
    }
  };

  const { icon, color } = getCardStyles();
  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1, minWidth: 0 }}>
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 3 },
          '&:last-child': { pb: { xs: 1.5, sm: 3 } },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 1.5, md: 2 },
          }}
        >
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ fontWeight: 500, fontSize: { xs: '0.95rem', md: '1.1rem' } }}
          >
            {title}
          </Typography>
          {/* We wrap the icon in an Avatar-like Box for a clean look */}
          <Box
            sx={{
              backgroundColor: `${color}15`, // Adding '15' to a hex code makes it 15% transparent!
              color: color,
              p: 1,
              borderRadius: '50%',
              display: 'flex',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant='h4'
          sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          {amount}
        </Typography>
      </CardContent>
    </Card>
  );
}
