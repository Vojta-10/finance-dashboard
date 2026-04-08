import { Box, Container } from '@mui/material';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth='xs'>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        minHeight={'100vh'}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  );
}
