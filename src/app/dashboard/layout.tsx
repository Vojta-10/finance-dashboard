import { Box } from '@mui/material';
import DashboardShell from '../../components/dashboard/DashboardShell';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const username = user?.user_metadata?.username;

  return (
    <Box>
      <DashboardShell username={username}>{children}</DashboardShell>
    </Box>
  );
}
