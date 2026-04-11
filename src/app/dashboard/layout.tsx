import { Box } from '@mui/material';

export default function DashboardLayout({
  children,
}: {children: React.ReactNode}) {
  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* We will build a Sidebar component and drop it right here later! */}

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
    </>
  );
}