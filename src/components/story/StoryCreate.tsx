import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import StoryForm from './StoryForm';
import { createStory } from '../../api/story';
import { useState } from 'react';

export default function StoryCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const saveStory = async (formData: FormData) => {
    try {
      const savedStory = await createStory(formData);
      navigate(`/story/${savedStory.id}`);
    } catch (err: any) {
      setError(err.toString());
    }
  }

  const cancelSave = () => {
    navigate("/");
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <StoryForm onSubmit={saveStory} onCancel={cancelSave} error={error}/>
    </Box>
  );
}