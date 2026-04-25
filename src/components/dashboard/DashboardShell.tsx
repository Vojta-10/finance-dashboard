'use client';

import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

type DashboardShellProps = {
  username?: string;
  children: React.ReactNode;
};

export default function DashboardShell({
  username,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevOpen) => !prevOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }}>
      <AppBar
        position='fixed'
        sx={{
          display: { xs: 'flex', md: 'none' },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open sidebar'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar username={username} />

      <Sidebar
        username={username}
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerClose}
        onNavigate={handleDrawerClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          p: { xs: 1.5, sm: 2, md: 3 },
          mt: { xs: 8, md: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
