import { PageDataNode } from '../types/page';
import { LikesResponse, PaginatedResponse, StoryData } from '../types/story';
import axios from './axios';

export type FetchParams = {
  query?: string;
  page?: number;
  size?: number;
  sortField?: 'createdAt' | 'likes' | 'favorites' | 'title' | 'reads';
  sortOrder?: 'asc' | 'desc';
};

const fetchStoriesData = async (
  endpoint: string,
  params?: FetchParams
): Promise<PaginatedResponse<StoryData>> => {
  const {
    query,
    page = 0,
    size = 10,
    sortField = 'createdAt',
    sortOrder = 'desc',
  } = params || {};

  const requestParams: Record<string, any> = {
    page,
    size,
    sort: `${sortField},${sortOrder}`,
  };

  if (query) requestParams.q = query;

  const response = await axios.get<PaginatedResponse<StoryData>>(endpoint, {
    params: requestParams,
  });

  return response.data;
};

export const fetchStory = async (id: number) => {
  const response = await axios.get(`/story/preview/${id}`);
  return response.data;
};

export const fetchStories = async (
  params?: FetchParams
): Promise<PaginatedResponse<StoryData>> => {
  return fetchStoriesData('/story', params);
};

export const fetchFavorite = async (
  params?: FetchParams
): Promise<PaginatedResponse<StoryData>> => {
  return fetchStoriesData('/story/favorite', params);
};

export const fetchLiked = async (
  params?: FetchParams
): Promise<PaginatedResponse<StoryData>> => {
  return fetchStoriesData('/story/liked', params);
};

export const fetchTrending = async (
  params?: FetchParams
): Promise<PaginatedResponse<StoryData>> => {
  return fetchStoriesData('/story/trending', params);
};

export const fetchUserStories = async (
  params?: FetchParams
): Promise<PaginatedResponse<StoryData>> => {
  return fetchStoriesData('/story/mine', params);
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