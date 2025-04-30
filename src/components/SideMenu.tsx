import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MenuContent from './MenuContent';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const isOpen = useSelector((state: RootState) => state.sidebar.open);
  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      anchor="left"
      sx={{
        width: isOpen ? drawerWidth : 0, //TODO: Refactor when adding redux
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
        {/* <CardAlert /> */}
      </Box>
    </Drawer>
  );
}