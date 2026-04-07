'use client';

import Container from '@mui/material/Container';
import { Box, Button, Link, TextField, Typography, Alert } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import * as z from 'zod';
import { clear } from 'console';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    clearErrors('root');
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError('root', {
        type: 'server',
        message: 'Invalid login credentials',
      });
      setTimeout(() => {
        clearErrors('root');
      }, 5000);
      return;
    }
  };
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
        {errors.root && (
          <Alert severity='error' sx={{ mb: 2, width: '100%' }}>
            {errors.root.message}
          </Alert>
        )}
        <TextField
          label='Email'
          type='email'
          variant='outlined'
          margin='normal'
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
        />
        <TextField
          label='Password'
          type='password'
          variant='outlined'
          margin='normal'
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
        />
        <Button
          variant='contained'
          color='primary'
          sx={{ mt: 4, p: 2 }}
          size='large'
          fullWidth
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting ? true : false}
          loadingIndicator='Logging in...'
        >
          Login
        </Button>
        <Typography sx={{ mt: 4 }}>
          Don&apos;t have an account?{' '}
          <Link underline='none' href='/register'>
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
