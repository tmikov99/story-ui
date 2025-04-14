import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import { brand, gray } from '../theme/themePrimitives';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../redux/sidebarSlice';
import Divider, { dividerClasses } from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { listClasses } from '@mui/material/List';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { Button, Stack } from '@mui/material';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'border 120ms ease-in',
  '&:hover': {
    borderColor: gray[400],
  },
  [`&.${inputBaseClasses.focused}`]: {
    outline: `3px solid ${alpha(brand[500], 0.5)}`,
    borderColor: brand[400],
  },
  ...theme.applyStyles('dark', {
    '&:hover': {
      borderColor: gray[500],
    },
   }),
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',  
    [theme.breakpoints.up('sm')]: {
        width: '25ch',
    },
    [theme.breakpoints.up('md')]: {
        width: '45ch',
    },
    [theme.breakpoints.up('lg')]: {
        width: '60ch',
    },
  },
}));


export default function AppHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = useSelector((state: RootState) => state.auth.username);
  const initials = username?.charAt(0).toUpperCase();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
  //   React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleMobileMenuClose = () => {
  //   setMobileMoreAnchorEl(null);
  // };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // handleMobileMenuClose();
  };

  const handleCreateStory = () => {
    navigate('/create');
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
    handleMenuClose();
  }

  // const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        [`& .${listClasses.root}`]: {
          padding: '8px',
        },
        [`& .${dividerClasses.root}`]: {
          margin: '8px -8px',
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          p: 1,
          gap: 1,
          alignItems: 'center',
          // borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="Test User"
          // src="/assets/book-white.svg" //TODO add photo
          sx={{ width: 36, height: 36 }}
        >
          {initials}
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {username}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            test@email.com
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <Divider />
      <MenuItem
        onClick={handleLogout}
        sx={{
          [`& .${listItemIconClasses.root}`]: {
            ml: 'auto',
            minWidth: 0,
          },
        }}
      >
        <ListItemText>Logout</ListItemText>
        <ListItemIcon>
          <LogoutRoundedIcon fontSize="small" />
        </ListItemIcon>
      </MenuItem>
    </Menu>
  );

  // const mobileMenuId = 'primary-search-account-menu-mobile';
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl={mobileMoreAnchorEl}
  //     anchorOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     open={isMobileMenuOpen}
  //     onClose={handleMobileMenuClose}
  //   >
  //     <MenuItem>
  //       <IconButton
  //         size="large"
  //         aria-label="show 17 new notifications"
  //       >
  //         <Badge badgeContent={17} color="error">
  //           <NotificationsIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Notifications</p>
  //     </MenuItem>
  //     <MenuItem onClick={handleProfileMenuOpen}>
  //       <IconButton
  //         size="large"
  //         aria-label="account of current user"
  //         aria-controls="primary-search-account-menu"
  //         aria-haspopup="true"
  //       >
  //         <AccountCircle />
  //       </IconButton>
  //       <p>Profile</p>
  //     </MenuItem>
  //   </Menu>
  // );

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => dispatch(toggleSidebar())}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block', cursor: "pointer" } }}
            onClick={() => navigate('/')}
          >
            Story
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && <Button 
            size='large' 
            variant='outlined' 
            sx={{borderRadius:"24px"}} 
            startIcon={<AddRoundedIcon/>}
            onClick={handleCreateStory}
          >
            Create
          </Button>}
          <ColorModeIconDropdown />
          {isAuthenticated ? <Box sx={{ display: 'flex' }}>
          {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}> */}
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              disableRipple
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{padding: 0, ml: 1}}
            >
              <Avatar>{initials?.charAt(0)}</Avatar>
            </IconButton>
          </Box> :
          <Button 
            variant='outlined' 
            startIcon={<AccountCircleRoundedIcon />}
            onClick={() => navigate('/signIn')}
            sx={{ ml: 1}}
          >
            Sign In
          </Button>
          }
          {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>
    {/* {renderMobileMenu} */}
    {isAuthenticated && renderMenu}
    </>
  );
}