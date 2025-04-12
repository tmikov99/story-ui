import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchStory } from '../api/story';
import { StoryData } from '../types/story';
import { useUserPlaythrough } from '../hooks/useUserPlaythrough';

export default function StoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storyId = Number(id)
  const [story, setStory] = useState<StoryData | null>(null);

  if (!id) {
    return(<div>ERROR</div>)
  }

  const { playthrough, savePage, resetPlaythrough } = useUserPlaythrough(storyId);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const data = await fetchStory(storyId);
        setStory(data);
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };
  
    loadData();
  }, [id])

  const handleStartPlaythrough = () => {
    if (!story) {
      console.log("Missing Story Error")
      return;
    }
    if (!playthrough) {
      savePage(story.startPage)
      navigate(`/story/${id}/page/${story.startPage}`);
    } else {
      navigate(`/story/${id}/page/${playthrough.currentPageId}`);
    }
    
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Story Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
      >
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box         
            onClick={handleStartPlaythrough}
            sx={{
              position: "relative",
              '&:hover .startText': {
                  opacity: 1,
                  cursor: 'pointer',
              },
              '&:hover img': {
                  cursor: 'pointer',
                  opacity: '0.7',
              }
            }}
          >
            <Box
                component="img"
                sx={{
                    width: '100%',
                    transition: '0.3s',
                }}
                src="/assets/pexels-helloaesthe-small.jpg"
            />
            <Typography className="startText" variant='h3' sx={{
                position: "absolute",
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%);',
                padding: 2,
                opacity: 0,
                transition: '0.3s',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white!important',
            }}>
                {playthrough ? `Continue Reading` : `Start Reading`}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack>
              <Typography variant='h4'>{story?.title}</Typography>
              <Typography variant='h6'>By: {story?.user.username}</Typography>
              <Typography>Pages: {story?.pageCount}</Typography>
              <Typography>Created: 12 May 2028</Typography>
              <Typography>Tags: {story?.tags.join(" ")}</Typography>
              <Typography>Description: {story?.description}
              </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        0 Comments
      </Typography>
      <Stack>
        {/*comments placeholder*/}
      </Stack>
    </Box>
  );
}