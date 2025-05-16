import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import StoryForm from './StoryForm';
import { createStory } from '../../api/story';

export default function StoryCreate() {
  const navigate = useNavigate();

  const saveStory = async (formData: FormData) => {
    const savedStory = await createStory(formData);
    navigate(`/story/${savedStory.id}`);
  }

  const cancelSave = () => {
    navigate("/");
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <StoryForm onSubmit={saveStory} onCancel={cancelSave}/>
    </Box>
  );
}