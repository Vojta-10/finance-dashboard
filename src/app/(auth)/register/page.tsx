import { Typography } from '@mui/material';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div>
      <Typography variant='h4' textAlign={'center'} gutterBottom sx={{ mb: 4 }}>
        Create Account
      </Typography>
      <RegisterForm />
    </div>
  );
}
