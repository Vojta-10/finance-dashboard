import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/auth';

export function useRegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    clearErrors('root');
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: data.username,
        },
      },
    });
    if (error) {
      setError('root', {
        type: 'server',
        message: error.message,
      });
      setTimeout(() => {
        clearErrors('root');
      }, 5000);
      return;
    }

    console.log(
      'Registration successful, please check your email for confirmation',
    );
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting,
  };
}
