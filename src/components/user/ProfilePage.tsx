import { Avatar, Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../../api/user";
import { useParams } from "react-router-dom";
import { UserData } from "../../types/story";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function ProfilePage() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState<UserData | null>(null);
  const { username } = useParams();

  const updateUser = async (username: string | undefined) => {
    if (!username) {
      return;
    }
    const userResponse = await getUserByUsername(username);
    setUser(userResponse);
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    updateUser(username);
  }, [username])

  return (
    <Box sx={{ width: '100%' }}>
      <Stack 
        direction="row"
        gap={3}
        sx={{
          alignItems: "center",
          m: 2,
        }}
      >
        <Avatar sx={{height: 200, width: 200, fontSize: 100}} src={user?.imageUrl}>{user?.username[0]}</Avatar>
        <Box>
          <Typography variant="h2">{user?.username}</Typography>
          <Typography variant="body2">X Stroies</Typography>
        </Box>
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} 
          aria-label="profile tabs"
        >
          <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Stories" {...a11yProps(1)} />
          <Tab label="Series" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography>Stories</Typography>
        <Typography>Popular Stories</Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Stories by creation date
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Series playlists
      </CustomTabPanel>
    </Box>
  );
}