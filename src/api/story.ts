import { StoryData } from '../types/story';
import axios from './axios';

export const fetchStory = async (id: number) => {
  const response = await axios.get(`/story/preview/${id}`);
  return response.data;
};

export const fetchStories = async () => {
  const response = await axios.get('/story');
  return response.data;
};

export const createStory = async (storyData: StoryData) => {
  const response = await axios.post('/story/create', storyData);
  return response.data;
};