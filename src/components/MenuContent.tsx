import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useLocation, Link } from 'react-router-dom';


const mainListItems1 = [
  { text: 'Home', icon: <AutoStoriesRoundedIcon />, path: '/' },
  { text: 'Trending', icon: <AutoStoriesRoundedIcon />, path: '/page' },
];
const mainListItems2 = [
  { text: 'History', icon: <AutoStoriesRoundedIcon />, path: '/create'},
  { text: 'Favotie stories', icon: <FavoriteRoundedIcon />, path: '/favorite' },
  { text: 'Liked stories', icon: <ThumbUpAltRoundedIcon />, path: '/liked' },
  { text: 'Liked stories', icon: <AutoStoriesRoundedIcon />, path: '/home' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/account' },
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
            <ListItemButton selected={pathname == item.path} component={Link} to={item.path}>
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