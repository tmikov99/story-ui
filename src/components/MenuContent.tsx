import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useLocation, Link } from 'react-router-dom';


const mainListItems1 = [
  { text: 'Home', icon: <AutoStoriesRoundedIcon />, path: '/' },
  { text: 'Trending', icon: <AutoStoriesRoundedIcon />, path: '/page' },
];
const mainListItems2 = [
  { text: 'History', icon: <AutoStoriesRoundedIcon />, path: '/create'},
  { text: 'Saved stories', icon: <LanRoundedIcon />, path: '/createPage' },
  { text: 'Read later', icon: <AnalyticsRoundedIcon />, path: '/createLinks' },
  { text: 'Liked stories', icon: <AutoStoriesRoundedIcon />, path: '/home' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/story' },
  { text: 'Notes', icon: <AssignmentRoundedIcon />, path: '/notes' },
];

export default function MenuContent() {
  const location = useLocation();
  const { pathname, hash } = location;
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <Box>
      <List dense>
        {mainListItems1.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={pathname == item.path} component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List dense>
        {mainListItems2.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={hash == item.path} component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </Box>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={hash == item.path} component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}