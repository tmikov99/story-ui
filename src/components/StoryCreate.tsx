import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { StoryFormData } from '../types/story';
import StoryForm from './StoryForm';
import { createStory } from '../api/story';

export default function StoryCreate() {
  const navigate = useNavigate();
  const saveStory = async (story: StoryFormData) => {
    const savedStory = await createStory(story);
    navigate(`/create/${savedStory.id}/overview`);
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <StoryForm onSubmit={saveStory} />
    </Box>
  );
}