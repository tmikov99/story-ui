import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HighlightedCard from './HighlightedCard';
import StoryCard from './StoryCard';
import { useEffect, useState } from 'react';
import { fetchStories } from '../api/story';
import { StoryData } from '../types/story';
import { useNavigate } from 'react-router-dom';

export default function MainGrid() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<StoryData[]>([]);

  useEffect(() => {
    fetchStories().then((response) => {
      setStories(response);
    });
  }, [])

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Favorites
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {stories.map((story, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StoryCard story={story} onClick={(story) => navigate(`/story/${story.id}`)}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}