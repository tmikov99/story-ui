import { PageDataNode } from '../types/page';
import { StoryFormData } from '../types/story';
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

export const updateStoryPages = async (storyId: number, pages: PageDataNode[]) => {
  const response = await axios.put(`/story/pages/${storyId}`, pages);
  return response.data;
}

export const deleteStory = async (id: number) => {
  const response = await axios.delete(`/story/${id}`);
  return response;
}

export const fetchGenres = async () => {
  const response = await axios.get('/story/genres');
  return response.data;
}

export const createComment = async (storyId: number, commentText: string) => {
  const response = await axios.post(`/comments/story/${storyId}`, commentText,
    {headers: {'Content-Type': 'text/plain'}}
  );
  return response.data;
}

export const fetchComments = async (storyId: number) => {
  const response = await axios.get(`/comments/story/${storyId}`);
  return response.data;
}