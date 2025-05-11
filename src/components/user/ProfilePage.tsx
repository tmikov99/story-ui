import { Avatar, Box, Button, Pagination, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../../api/user";
import { useNavigate, useParams, useSearchParams  } from "react-router-dom";
import { StoryData, UserData } from "../../types/story";
import Grid from '@mui/material/Grid2';
import StoryCard from "../story/StoryCard";
import { fetchLatestPublishedByUser, fetchMostReadByUser, fetchPublishedByUser } from "../../api/story";
import { stringToHslColor } from "../../utils/userColors";

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

type HeaderProps = {
  children: React.ReactNode;
};


function Header({ children }: HeaderProps) {
  return(
    <Stack
      direction="row"
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
      }}
      spacing={2}
    >
      {children}
    </Stack>
  )
}

type StoryGridProps = {
  stories: StoryData[];
  onClick: (story: StoryData) => void;
};

const StoryGrid = ({ stories, onClick }: StoryGridProps) => (
  <Grid 
    container
    spacing={2}
    columns={12}
    sx={{ mb: (theme) => theme.spacing(2) }}
  >
    {stories.map((story) => (
      <Grid key={story.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
        <StoryCard storyData={story} showActions={true} onClick={() => onClick(story)} />
      </Grid>
    ))}
  </Grid>
);

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = parseInt(searchParams.get('tab') || '0', 10);
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const sortParam = searchParams.get('sort') || 'latest';
  const [totalPages, setTotalPages] = useState(0);
  const [value, setValue] = useState(tabParam);
  const page = pageParam - 1;
  const pageSize = 12;
  const [user, setUser] = useState<UserData | null>(null);
  const [latestStories, setLatestStories] = useState<StoryData[]>([]);
  const [popularStories, setPopularStories] = useState<StoryData[]>([]);
  const [allStories, setAllStories] = useState<StoryData[]>([]);
  const { username } = useParams();
  const navigate = useNavigate();

  const [storiesCount, setStoriesCount] = useState(0);

  const navigateToStory = (story: StoryData) => navigate(`/story/${story.id}`)

  const updateUser = async (username: string | undefined) => {
    if (!username) {
      return;
    }
    const userResponse = await getUserByUsername(username);
    setUser(userResponse);
  }

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', newValue.toString());
      if (newValue !== 1) {
        params.delete('page');
        params.delete('request');
      }
      return params;
    });
  };

  const updateHomeTab = async () => {
    if (user === null) return;
    const [latest, mostRead] = await Promise.all([
      fetchLatestPublishedByUser(user.username), 
      fetchMostReadByUser(user.username)
    ]);
    setLatestStories(latest.content);
    setPopularStories(mostRead.content);
    setStoriesCount(latest.totalElements);
  }

  const updateStoriesTab = async () => {
    if (!user) return;
    const stories = await fetchPublishedByUser(user.username, {
      page,
      size: pageSize,
      sort: (searchParams.get('sort') as 'latest' | 'oldest' | 'most_read') || 'latest',
    });
    setAllStories(stories.content);
    setTotalPages(stories.totalPages);
    setStoriesCount(stories.totalElements);
  };

  useEffect(() => {
    updateUser(username);
  }, [username]);

  useEffect(() => {
    if (value === 0) {
      updateHomeTab();
    }
  }, [user, value]);

  useEffect(() => {
    if (value === 1 && user) {
      updateStoriesTab();
    }
  }, [user, value, page, sortParam]);

  const handleShowAllClick = (sort: string) => {
    setValue(1);
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('tab', '1'); 
      params.set('sort', sort);
      params.set('page', '1');
      return params;
    });
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Stack 
        direction="row"
        gap={3}
        sx={{
          alignItems: "center",
          m: 2,
        }}
      >
        <Avatar 
          sx={{ 
            height: 200, 
            width: 200, 
            fontSize: 100, 
            bgcolor: stringToHslColor(user?.username) 
          }} 
          src={user?.imageUrl}
        >
          {user?.username[0]}
        </Avatar>
        <Box>
          <Typography variant="h2">{user?.username}</Typography>
          <Typography variant="body2">{storiesCount} Stories</Typography>
        </Box>
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} 
          aria-label="profile tabs"
        >
          <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Stories" {...a11yProps(1)} />
          {/* <Tab label="Series" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Header>
          <Typography variant="h4">Uploads</Typography>
          <Button variant="contained" onClick={() => handleShowAllClick('latest')}>View All</Button>
        </Header>
        <StoryGrid stories={latestStories} onClick={navigateToStory} />
        <Header>
          <Typography variant="h4">Popular</Typography>
          <Button variant="contained" onClick={() => handleShowAllClick('most_read')}>View All</Button>
        </Header>
        <StoryGrid stories={popularStories} onClick={navigateToStory} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Header>
          {/* <Typography variant="h4">Stories</Typography> */}
          <Stack direction="row" spacing={1}>
            <Button
              variant={sortParam === 'latest' ? 'contained' : 'outlined'}
              onClick={() => {
                setSearchParams(prev => {
                  const params = new URLSearchParams(prev);
                  params.set('sort', 'latest');
                  params.set('page', '1');
                  return params;
                });
              }}
            >
              Latest
            </Button>
            <Button
              variant={sortParam === 'oldest' ? 'contained' : 'outlined'}
              onClick={() => {
                setSearchParams(prev => {
                  const params = new URLSearchParams(prev);
                  params.set('sort', 'oldest');
                  params.set('page', '1');
                  return params;
                });
              }}
            >
              Oldest
            </Button>
            <Button
              variant={sortParam === 'most_read' ? 'contained' : 'outlined'}
              onClick={() => {
                setSearchParams(prev => {
                  const params = new URLSearchParams(prev);
                  params.set('sort', 'most_read');
                  params.set('page', '1');
                  return params;
                });
              }}
            >
              Popular
            </Button>
          </Stack>
        </Header>

        <StoryGrid stories={allStories} onClick={navigateToStory} />

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, newPage) => {
                setSearchParams(prev => {
                  const params = new URLSearchParams(prev);
                  params.set('page', newPage.toString());
                  return params;
                });
              }}
              siblingCount={2}
              shape="rounded"
            />
          </Box>
        )}
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        Series playlists
      </CustomTabPanel> */}
    </Box>
  );
}