import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageCard from './PageCard';
import { useNavigate, useParams } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useEffect, useState } from 'react';
import { fetchPagesMapByStory } from '../api/page';
import { Button } from '@mui/material';
import PageGraph from './PageGraph';

export default function PageLinks() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!storyId) return;

    const fetchPages = async () => {
      try {
        const response = await fetchPagesMapByStory(Number(storyId));
        setPages(response);
      } catch (err) {
        console.error("Failed to fetch pages:", err);
      }
    };

    fetchPages();
  }, [storyId]);
  
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {pages.length > 0 && <PageGraph pages={pages} storyId={Number(storyId)} rootPageNumber={1}/>}
    </Box>
  );
}