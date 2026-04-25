'use client';

import React from 'react';
import { Divider, Drawer } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { DrawerProps } from '@mui/material/Drawer';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import SidebarFooter from './sidebar/SidebarFooter';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavList from './sidebar/SidebarNavList';
import type { NavItem } from './sidebar/types';

export const DRAWER_WIDTH = 240;

const navItems: NavItem[] = [
  { text: 'Overview', icon: DashboardIcon, href: '/dashboard' },
  {
    text: 'Transactions',
    icon: ReceiptLongIcon,
    href: '/dashboard/transactions',
  },
  {
    text: 'Categories',
    icon: CategoryIcon,
    href: '/dashboard/categories',
  },
];

const navButtonSx: SxProps<Theme> = {
  my: 0.5,
  mx: 1,
  borderRadius: 1,
};

type SidebarProps = {
  username?: string;
  variant?: DrawerProps['variant'];
  open?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
  sx?: SxProps<Theme>;
};

export default function Sidebar({
  username,
  variant = 'permanent',
  open,
  onClose,
  onNavigate,
  sx,
}: SidebarProps) {
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

  const drawerSx: SxProps<Theme> = {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    ...(variant === 'permanent'
      ? { display: { xs: 'none', md: 'block' } }
      : {}),
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
      borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      backgroundColor: 'background.paper',
    },
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={sx ? ([drawerSx, sx] as SxProps<Theme>) : drawerSx}
    >
      <SidebarHeader username={username} />

      <Divider />

      <SidebarNavList
        items={navItems}
        pathname={pathname}
        itemSx={navButtonSx}
        onItemClick={onNavigate}
      />

      <Divider />

      <SidebarFooter onLogout={handleLogout} itemSx={navButtonSx} />
    </Drawer>
  );
}
