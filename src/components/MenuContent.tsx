import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const mainListItems1 = [
  { text: 'Home', icon: <AutoStoriesRoundedIcon /> },
  { text: 'Trending', icon: <AutoStoriesRoundedIcon /> },
];
const mainListItems2 = [
  { text: 'History', icon: <AutoStoriesRoundedIcon /> },
  { text: 'Saved stories', icon: <LanRoundedIcon /> },
  { text: 'Read later', icon: <AnalyticsRoundedIcon /> },
  { text: 'Liked stories', icon: <AutoStoriesRoundedIcon /> },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'Notes', icon: <AssignmentRoundedIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <Box>
      <List dense>
        {mainListItems1.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0}>
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
            <ListItemButton selected={false}>
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
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}