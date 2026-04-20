import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // If they are logged in, instantly route them to the secure zone
    redirect('/dashboard');
  } else {
    // If they have no session, instantly route them to authenticate
    redirect('/login');
  }
}