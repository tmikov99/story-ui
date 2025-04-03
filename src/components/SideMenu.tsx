import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';

const drawerWidth = 240;

interface SideMenuProps { 
  //TODO: Refactor when adding redux
  open: boolean;
}

const Drawer = styled(MuiDrawer)({
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu({ open }: SideMenuProps) {
  return (
    <Drawer
      variant="persistent"
      open={open}
      anchor="left"
      sx={{
        width: open ? drawerWidth : 0, //TODO: Refactor when adding redux
        transition: 'width 0.2s',
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* <Divider /> */}
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 7,
        }}
      >
        <MenuContent />
        <CardAlert />
      </Box>
      {/* <Divider /> */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="Test User"
          // src="src/assets/book-white.svg" //TODO add photo
          sx={{ width: 36, height: 36 }}
        >
          T
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            Test User
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            test@email.com
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}