import LogoutIcon from '@mui/icons-material/Logout';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type SidebarFooterProps = {
  onLogout: () => Promise<void>;
  itemSx: SxProps<Theme>;
};

export default function SidebarFooter({
  onLogout,
  itemSx,
}: SidebarFooterProps) {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={onLogout} sx={itemSx}>
          <ListItemIcon>
            <LogoutIcon color='error' />
          </ListItemIcon>
          <ListItemText
            primary='Sign Out'
            slotProps={{
              primary: {
                color: 'error',
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
