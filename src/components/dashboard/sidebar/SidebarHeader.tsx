import { Box, Typography } from '@mui/material';

interface SidebarHeaderProps {
  username?: string;
}

export default function SidebarHeader({ username }: SidebarHeaderProps) {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant='h5' fontWeight='bold' color='primary'>
        Welcome, {username ? username : 'User'}!
      </Typography>
    </Box>
  );
}
