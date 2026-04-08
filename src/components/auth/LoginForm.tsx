'use client';

import { TextField, Button, Typography, Link, Alert, Box } from '@mui/material';
import { useLoginForm } from '@/hooks/useLoginForm';

export default function LoginForm() {
  const { register, handleSubmit, errors, onSubmit, isSubmitting } =
    useLoginForm();
  return (
    <>
      {errors.root && (
        <Alert severity='error' sx={{ mb: 2, width: '100%' }}>
          {errors.root.message}
        </Alert>
      )}
      <Box>
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
        <Typography sx={{ mt: 4, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link underline='none' href='/register'>
            Register here
          </Link>
        </Typography>
      </Box>
    </>
  );
}
