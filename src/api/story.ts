import axios from './axios';

export const fetchStories = async () => {
  const response = await axios.get('/story');
  return response.data;
};

export const createStory = async (storyData: any) => {
  const response = await axios.post('/story/create', storyData);
  return response.data;
};