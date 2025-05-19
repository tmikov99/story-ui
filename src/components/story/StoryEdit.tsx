import Box from '@mui/material/Box';
import { useNavigate, useParams } from 'react-router-dom';
import { StoryFormData } from '../../types/story';
import StoryForm from './StoryForm';
import { fetchStory, updateStory } from '../../api/story';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../redux/snackbarSlice';

export default function StoryEdit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {storyId} = useParams();
  const [story, setStory] = useState<StoryFormData>({
    title: '',
    genres: [],
    tags: [],
    description: '',
    status: ''
  });
  const [error, setError] = useState<string | null>(null);

  const saveStory = async (formData: FormData) => {
    if (!storyId) return;

    try {
      const savedStory = await updateStory(formData, storyId);
      navigate(`/story/${savedStory.id}`);
    } catch (err: any) {
      setError(err.toString());
    }
  }

  const cancelSave = () => {
    navigate(`/story/${storyId}`);
  }

  const getOriginalStory = async (storyId: number) => {
    try {
      const originalStory = await fetchStory(storyId);
      setStory({
        title: originalStory.title,
        genres: originalStory.genres,
        tags: originalStory.tags,
        description: originalStory.description,
        coverImageUrl: originalStory.coverImageUrl,
        status: originalStory.status,
      });
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to fetch story.", severity: "error" }));
    }
  }

  useEffect(() => {
    getOriginalStory(Number(storyId));
  }, [storyId]);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <StoryForm 
        onSubmit={saveStory} 
        onCancel={cancelSave} 
        initialData={story} 
        error={error}
      />
    </Box>
  );
}