import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchPagesMapByStory } from '../../api/page';
import PageGraph from './PageGraph';
import { fetchStory } from '../../api/story';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../redux/snackbarSlice';

export default function PageLinks() {
  const { storyId } = useParams();
  const [pages, setPages] = useState(null);
  const [rootPageNumber, setRootPageNumber] = useState<number>(0);
  const dispatch = useDispatch();

  const fetchStoryPageData = async () => {
    try {
      const [fetchedPages, story] = await Promise.all([
        fetchPagesMapByStory(Number(storyId)),
        fetchStory(Number(storyId)),
      ]);
      setPages(fetchedPages);
      setRootPageNumber(story.startPageNumber);
    } catch (err) {
      dispatch(showSnackbar({ message: "Failed to fetch story or pages.", severity: "error" }));
    }
  };

  useEffect(() => {
    if (!storyId) return;
    fetchStoryPageData();
  }, [storyId]);
  

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {pages !== null && (
        <PageGraph 
          pages={pages} 
          storyId={Number(storyId)} 
          rootPageNumber={rootPageNumber}
          setRootPageNumber={setRootPageNumber} 
        />
      )}
    </Box>
  );
}