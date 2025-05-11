import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import PhotoRoundedIcon from '@mui/icons-material/PhotoRounded';
import BookRoundedIcon from '@mui/icons-material/BookRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useLocation, Link } from 'react-router-dom';
import { SvgIconComponent } from "@mui/icons-material";


interface OptionsListItem {
  text: string;
  icon: SvgIconComponent;
  path: string;
}

const mainListItems1 = [
  { text: 'Home', icon: HomeRoundedIcon, path: '/' },
  { text: 'Trending', icon: StarRoundedIcon, path: '/trending' },
];
const mainListItems2 = [
  { text: 'History', icon: HistoryRoundedIcon, path: '/history'},
  { text: 'Favotie stories', icon: FavoriteRoundedIcon, path: '/favorite' },
  { text: 'Liked stories', icon: ThumbUpAltRoundedIcon, path: '/liked' },
];
const mainListItems3 = [
  { text: 'My stories', icon: BookRoundedIcon, path: '/created'},
  { text: 'My comments', icon: CommentRoundedIcon, path: '/comments' },
];

const secondaryListItems = [
  { text: 'Landing page', icon: PhotoRoundedIcon, path: '/landing' },
  { text: 'Settings', icon: SettingsRoundedIcon, path: '/account' },
  { text: 'Notes', icon: AssignmentRoundedIcon, path: '/notes' },
];

const mapListItems = (listItems: OptionsListItem[], pathname: string) => {
  return <List dense>
    {listItems.map(({text, path, icon: Icon}, index) => (
      <ListItem key={index} disablePadding sx={{ display: 'block' }}>
        <ListItemButton selected={pathname == path} component={Link} to={path}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
} 

export default function MenuContent() {
  const location = useLocation();
  const { pathname } = location;
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <Box>
        {mapListItems(mainListItems1, pathname)}
        <Divider />
        {mapListItems(mainListItems2, pathname)}
        <Divider />
        {mapListItems(mainListItems3, pathname)}
      </Box>
      {mapListItems(secondaryListItems, pathname)}
    </Stack>
  );
}