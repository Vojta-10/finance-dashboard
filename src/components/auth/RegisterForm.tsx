'use client';

import { Button, Link, TextField, Typography, Alert } from '@mui/material';
import { useRegisterForm } from '@/hooks/useRegisterForm';

export default function RegisterForm() {
  const { register, handleSubmit, errors, onSubmit, isSubmitting } =
    useRegisterForm();
  return (
    <>
      {errors.root && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {errors.root.message}
        </Alert>
      )}

      <TextField
        label='Username'
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
        fullWidth
      />
      <TextField
        label='Email'
        type='email'
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mt: 2 }}
        fullWidth
      />
      <TextField
        label='Password'
        type='password'
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ mt: 2 }}
        fullWidth
      />
      <TextField
        label='Confirm Password'
        type='password'
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{ mt: 2 }}
        fullWidth
      />
      <Button
        variant='contained'
        color='primary'
        size='large'
        fullWidth
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting ? true : false}
        loadingIndicator='Registering...'
        sx={{ mt: 4, p: 2 }}
      >
        Register
      </Button>
      <Typography sx={{ mt: 4, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link underline='none' href='/login'>
          Login here
        </Link>
      </Typography>
    </>
  );
}
