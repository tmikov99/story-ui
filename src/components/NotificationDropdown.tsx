import React, { useEffect, useState } from 'react';
import { IconButton, Menu, MenuItem, Badge, CircularProgress, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationData } from '../types/notification';
import { fetchNotifications, markAsRead } from '../api/notifications';
import { useNavigate } from 'react-router-dom';



export default function NotificationDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const getNotifications = async () => {
    if (open) return;
    setLoading(true);
    try {
      const res = await fetchNotifications();
      setNotifications(res);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
    setLoading(false);
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifications(prev => prev.map(item => ({...item, read: true})));
    setAnchorEl(event.currentTarget);
    markAsRead(notifications.map(notification => notification.id));
  };

  useEffect(() => {
    getNotifications();
    const interval = setInterval(getNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (notification.type === "ACHIEVED_VIEWS" || notification.type === "NEW_COMMENT") {
      navigate(`/story/${notification.targetId}`)
    }
    handleClose();
  }

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { width: 400, maxHeight: 400 },
          },
        }}
      >
        {loading ? (
          <MenuItem><CircularProgress size={20} /> &nbsp; Loading...</MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              sx={{ whiteSpace: 'normal' }} 
              onClick={() => handleNotificationClick(notification)}
            >
              <Typography variant="body2">{notification.message}</Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}