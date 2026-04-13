import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import NextLink from 'next/link';
import type { NavItem } from './types';

type SidebarNavListProps = {
  items: NavItem[];
  pathname: string;
  itemSx: SxProps<Theme>;
};

export default function SidebarNavList({
  items,
  pathname,
  itemSx,
}: SidebarNavListProps) {
  return (
    <List sx={{ flexGrow: 1, my: 3 }} disablePadding>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NextLink}
              href={item.href}
              selected={isActive}
              sx={itemSx}
            >
              <ListItemIcon
                sx={{ color: isActive ? 'primary.main' : 'inherit' }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: { fontWeight: isActive ? 'bold' : 'normal' },
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
