import LoginForm from '@/components/auth/LoginForm';
import { Typography } from '@mui/material';

export default function LoginPage() {
  return (
    <>
      <Typography variant='h4' component='h1' gutterBottom sx={{ mb: 4 }}>
        Login
      </Typography>
      <LoginForm />
    </>
  );
}
