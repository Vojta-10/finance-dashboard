import LoginForm from '@/components/auth/LoginForm';
import Container from '@mui/material/Container';
import { Box, Typography } from '@mui/material';


export default function LoginPage() {
  
  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom sx={{ mb: 4 }}>
          Login
        </Typography>

        <LoginForm />
      </Box>
    </Container>
  );
}
