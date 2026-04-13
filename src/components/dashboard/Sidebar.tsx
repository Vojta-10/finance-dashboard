'use client';

import React from 'react';
import { Divider, Drawer } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import SidebarFooter from './sidebar/SidebarFooter';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavList from './sidebar/SidebarNavList';
import type { NavItem } from './sidebar/types';

const DRAWER_WIDTH = 240;

const navItems: NavItem[] = [
  { text: 'Overview', icon: DashboardIcon, href: '/dashboard' },
  {
    text: 'Transactions',
    icon: ReceiptLongIcon,
    href: '/dashboard/transactions',
  },
];

const navButtonSx: SxProps<Theme> = {
  my: 0.5,
  mx: 1,
  borderRadius: 1,
};

export default function Sidebar({ username }: { username?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = React.useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  const handleLogout = React.useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }, [router, supabase]);

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <SidebarHeader username={username} />

      <Divider />

      <SidebarNavList
        items={navItems}
        pathname={pathname}
        itemSx={navButtonSx}
      />

      <Divider />

      <SidebarFooter onLogout={handleLogout} itemSx={navButtonSx} />
    </Drawer>
  );
}
