import { StoryData, StoryFormData } from '../types/story';
import axios from './axios';

export const fetchStory = async (id: number) => {
  const response = await axios.get(`/story/preview/${id}`);
  return response.data;
};

export const fetchStories = async () => {
  const response = await axios.get('/story');
  return response.data;
};

export const createStory = async (storyData: StoryFormData) => {
  const response = await axios.post('/story/create', storyData);
  return response.data;
};

export const fetchGenres = async () => {
  const response = await axios.get('/story/genres');
  return response.data;
}