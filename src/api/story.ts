import { PageDataNode } from '../types/page';
import { LikesResponse, StoryFormData } from '../types/story';
import axios from './axios';

export const fetchStory = async (id: number) => {
  const response = await axios.get(`/story/preview/${id}`);
  return response.data;
};

export const fetchStories = async () => {
  const response = await axios.get('/story');
  return response.data;
};

export const createStory = async (formData: FormData) => {
  const response = await axios.post('/story/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateStory = async (formData: FormData, storyId: string) => {
  const response = await axios.put(`/story/update/${storyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

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

export const toggleFavorite = async (storyId: number) => {
  const response = await axios.post(`/story/favorite/${storyId}`);
  return response.data;
}

export const toggleLike = async (storyId: number):Promise<LikesResponse> => {
  const response = await axios.post(`/story/like/${storyId}`);
  return response.data;
}

export const fetchFavorite = async () => {
  const response = await axios.get("/story/favorite");
  return response.data;
}

export const fetchLiked = async () => {
  const response = await axios.get("/story/liked");
  return response.data;
}