import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageCard from '../page/PageCard';
import { useNavigate, useParams } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useEffect, useState } from 'react';
import { fetchPagesByStory } from '../../api/page';
import { Button } from '@mui/material';

export default function StoryPagesOverview() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!storyId) return;

    const fetchPages = async () => {
      try {
        const response = await fetchPagesByStory(Number(storyId));
        setPages(response);
      } catch (err) {
        console.error("Failed to fetch pages:", err);
      }
    };

    fetchPages();
  }, [storyId]);

  const handleCreatePage = () => {
    navigate(`/create/${storyId}/page`);
  }
  
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Box sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Pages
        </Typography>
        <Button 
            size='large' 
            variant='outlined' 
            sx={{borderRadius:"24px", marginRight: 1}} 
            startIcon={<AddRoundedIcon/>}
            onClick={handleCreatePage}
          >
            Add Page
          </Button>
      </Box>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {pages.map((page, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
              <PageCard
                page={page}
                onClick={(currentPage) => navigate(`/edit/${storyId}/page/${currentPage.id}`)}
              />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}