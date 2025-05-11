import { Avatar, Box, Button, CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import { useEffect, useState } from "react";
import { saveUserPicture } from "../../api/images";
import { changePassword, getCurrentUser } from "../../api/user";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { User } from "../../types/user";
import { stringToHslColor } from "../../utils/userColors";

export default function AccountSettings() {
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const [user, setUser] = useState<User | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const fetchUser = async () => {
    if (!username) return;
    
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

  const handleChangePassword = async () => {
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await changePassword({currentPassword, newPassword});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setChangingPassword(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
  }

  const startChangingPassword = () => {
    resetPasswordFields();
    setChangingPassword(true);
  }

  const cancelChangingPassword = () => {
    resetPasswordFields();
    setChangingPassword(false);
  }

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
              fontSize: 100,
              bgcolor: stringToHslColor(user?.username),
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
            <TextField
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              type="password"
              label="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleChangePassword}>Confirm</Button>
              <Button variant="outlined" onClick={cancelChangingPassword}>Cancel</Button>
            </Stack>
          </> :
          <Button variant="contained" onClick={startChangingPassword}>Change Password</Button>
        }
      </Stack>
    </Box>
  );
}