import { Avatar, Box, Button, CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import { useEffect, useState } from "react";
import { saveUserPicture } from "../api/images";
import { getCurrentUser } from "../api/user";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { User } from "../types/user";

export default function AccountSettings() {
  const username = useSelector((state: RootState) => state.auth.username);
  const [user, setUser] = useState<User | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchUser = async () => {
    const userResponse = await getCurrentUser();
    if (userResponse) {
      setUser(userResponse);
    }
  }

  useEffect(() => {
    fetchUser(); 
  }, [username]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await saveUserPicture(formData);
      setUser(data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Stack gap={2} sx={{
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Typography component="h2" variant="h6" sx={{ width: '100%' }}>
          Account Settings
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: 200,
            height: 200,
            cursor: 'pointer',
            '&:hover .onHover': { display: 'flex' },
            '&:hover .offHover': { display: 'none' },
          }}
        >
          <Avatar 
            src={user ? user.imageUrl : undefined}
            alt={user ? user.username : undefined}
            sx={{
              width: '100%',   
              height: '100%', 
              fontSize: 100
          }}>
            <Typography className="offHover" sx={{fontSize: 100}}>{user?.username[0]}</Typography>
          </Avatar>
          {uploading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '50%',
              }}
            >
              <CircularProgress size={64} />
            </Box>
          )}
          <IconButton 
            className="onHover"
            sx={{
              display: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 100,
            }}
            disableRipple
            aria-label="upload photo"
            component="label"
          >
            <AddAPhotoRoundedIcon  sx={{fontSize: 100}} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </IconButton>
        </Box>
        
        <Typography variant="h2">{user?.username}</Typography>
        <Typography>{user?.email}</Typography>
        <Typography component="h2" variant="h6" sx={{ width: '100%' }}>
          Password Settings
        </Typography>
        {changingPassword ? 
          <>
            <TextField type="password" label="New Password"/>
            <TextField type="password" label="Confirm New Password" />
            <Button variant="contained" onClick={() => setChangingPassword(false)}>Confirm</Button>
          </> :
          <Button variant="contained" onClick={() => setChangingPassword(true)}>Change Password</Button>
        }
      </Stack>
    </Box>
  );
}