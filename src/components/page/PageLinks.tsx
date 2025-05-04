import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchPagesMapByStory } from '../../api/page';
import PageGraph from './PageGraph';

export default function PageLinks() {
  const { storyId } = useParams();
  const [pages, setPages] = useState(null);

  const fetchPages = async () => {
    try {
      const response = await fetchPagesMapByStory(Number(storyId));
      setPages(response);
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    }
  };

  useEffect(() => {
    if (!storyId) return;
    fetchPages();
  }, [storyId]);
  

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {pages !== null && <PageGraph pages={pages} storyId={Number(storyId)} rootPageNumber={1} />}
    </Box>
  );
}