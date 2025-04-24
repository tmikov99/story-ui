import Box from '@mui/material/Box';
import { useNavigate, useParams } from 'react-router-dom';
import { StoryFormData } from '../types/story';
import StoryForm from './StoryForm';
import { createStory, fetchStory } from '../api/story';
import { useEffect, useState } from 'react';

export default function StoryEdit() {
  const navigate = useNavigate();
  const {storyId} = useParams();
  const saveStory = async (story: StoryFormData) => {
    const savedStory = await createStory(story);
    navigate(`/story/${savedStory.id}`);
  }
  const [story, setStory] = useState<StoryFormData>({
    title: '',
    genres: [],
    tags: [],
    description: '',
    status: ''
  });

  const getOriginalStory = async (storyId: number) => {
    const originalStory = await fetchStory(storyId);
    setStory(originalStory);
  }

  useEffect(() => {
    getOriginalStory(Number(storyId));
  }, [storyId]);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <StoryForm onSubmit={saveStory} initialData={story} />
    </Box>
  );
}