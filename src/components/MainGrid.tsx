import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StoryCard from './StoryCard';
import { useEffect, useState } from 'react';
import { StoryData } from '../types/story';
import { useNavigate } from 'react-router-dom';

interface MainGridProps {
  fetchMethod: () => Promise<StoryData[]>;
  title: string;
  showActions: boolean;
}

export default function MainGrid({fetchMethod, title, showActions}: MainGridProps) {
  const navigate = useNavigate();
  const [stories, setStories] = useState<StoryData[]>([]);

  useEffect(() => {
    fetchMethod().then((response) => {
      setStories(response);
    });
  }, [fetchMethod])

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {stories.map((story, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
              <StoryCard storyData={story} showActions={showActions} onClick={(story) => navigate(`/story/${story.id}`)}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}