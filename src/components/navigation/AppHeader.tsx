import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { brand } from '../../theme/themePrimitives';
import ColorModeIconDropdown from '../../theme/ColorModeIconDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/sidebarSlice';
import Divider, { dividerClasses } from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/Close';
import { listClasses } from '@mui/material/List';
import { logout } from '../../redux/authSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Button, Stack } from '@mui/material';
import NotificationDropdown from '../NotificationDropdown';
import { stringToHslColor } from '../../utils/userColors';

const Search = styled(Box)(({ theme }) => ({
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
  display: 'flex',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  borderEndEndRadius: '0',
  borderEndStartRadius: theme.shape.borderRadius,
  borderStartEndRadius: '0',
  borderStartStartRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'border 120ms ease-in',
  [`&.${inputBaseClasses.focused}`]: {
    outline: `1px solid ${alpha(brand[500], 0.5)}`,
    borderColor: brand[400],
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 5, 1, 2),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '32ch',
    },
    [theme.breakpoints.up('lg')]: {
        width: '52ch',
    },
  },
}));


export default function AppHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const initials = user?.username.charAt(0).toUpperCase();
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = React.useState(() => searchParams.get('query') || '');


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    const currentQuery = searchParams.get('query') || '';
    setInputValue(currentQuery);
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const triggerSearch = () => {
    navigate({
      pathname: '/',
      search: `?query=${encodeURIComponent(inputValue)}`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateStory = () => {
    navigate('/create');
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/landing');
    handleMenuClose();
  }

  const handleProfileClick = () => {
    navigate(`/user/${user?.username}`);
    handleMenuClose();
  }

  const handleMyAccountClick = () => {
    navigate('/account');
    handleMenuClose();
  }

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
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="User Picture"
          src={user?.imageUrl}
          sx={{ width: 36, height: 36, bgcolor: stringToHslColor(user?.username) }}
        >
          {initials}
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user?.username}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user?.email}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleMyAccountClick}>My account</MenuItem>
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
            sx={{ display: { xs: 'none', sm: 'block' }, cursor: "pointer", width: 200 }}
            onClick={() => navigate('/')}
          >
            Story
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {inputValue && (
              <IconButton
                onClick={() => setInputValue('')}
                size="small"
                sx={{
                  position: 'absolute',
                  right: 46,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '8px',
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              onClick={triggerSearch}
              sx={(theme) => ({
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderEndEndRadius: theme.shape.borderRadius,
                borderEndStartRadius: '0',
                borderStartEndRadius: theme.shape.borderRadius,
                borderStartStartRadius: '0',
                '&:hover': {
                  backgroundColor: alpha(brand[500], 0.1),
                },
              })}
            >
              <SearchIcon />
            </IconButton>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && <Button 
            size='large' 
            variant='outlined' 
            sx={{borderRadius:"24px", marginRight: 1, minWidth: "fit-content"}} 
            startIcon={<AddRoundedIcon/>}
            onClick={handleCreateStory}
          >
            Create
          </Button>}
          <ColorModeIconDropdown />
          {isAuthenticated ? <Box sx={{ display: 'flex' }}>
            <NotificationDropdown />
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
              <Avatar 
                sx={{ bgcolor: stringToHslColor(user?.username) }}
                src={user?.imageUrl}
              >
                {initials?.charAt(0)}
              </Avatar>
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