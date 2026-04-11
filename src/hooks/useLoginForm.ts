import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase/client';
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth';
import { useRouter } from 'next/navigation';

export function useLoginForm() {
  const router = useRouter();
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
    router.push('/dashboard');
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting,
  };
}
