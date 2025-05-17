import { PageDataNode } from '../types/page';
import { LikesResponse, PaginatedResponse, StoryData } from '../types/story';
import axios from './axios';

export type FetchParams = {
  query?: string;
  page?: number;
  size?: number;
  sortField?: 'createdAt' | 'likes' | 'favorites' | 'title' | 'reads';
  sortOrder?: 'asc' | 'desc';
  sort?: 'latest' | 'oldest' | 'most_read';
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
    sort,
  } = params || {};

  const requestParams: Record<string, any> = {
    page,
    size,
    sort: `${sortField},${sortOrder}`,
  };

  if (query) requestParams.q = query;
  if (sort) requestParams.sort = sort;

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

export const fetchLatestPublishedByUser = async (username: string) => {
  return fetchStoriesData(`/story/user/${username}/stories`, {
    sort: 'latest',
    page: 0,
    size: 4,
  });
};

export const fetchMostReadByUser = async (username: string) => {
  return fetchStoriesData(`/story/user/${username}/stories`, {
    sort: 'most_read',
    page: 0,
    size: 4,
  });
};

export const fetchPublishedByUser = async (
  username: string,
  params?: FetchParams
): Promise<PaginatedResponse<StoryData>> => {
  return fetchStoriesData(`/story/user/${username}/stories`, params);
};

export const createStory = async (formData: FormData) => {
  try {
    const response = await axios.post('/story/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create story.";
  }
};

export const updateStory = async (formData: FormData, storyId: string) => {
  try {
    const response = await axios.put(`/story/update/${storyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update story.";
  }
}

export async function updateStartPageNumber(storyId: number, pageNumber: number) {
  return await axios.patch(`/story/${storyId}/start-page`, { startPageNumber: pageNumber });
}

export const copyStoryDraft = async (storyId: number) => {
  const response = await axios.post(`/story/copyAsDraft/${storyId}`);
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

export const archiveStory = async (id: number) => {
  const response = await axios.put(`/story/archive/${id}`);
  return response.data;
}

export const publishStory = async (id: number) => {
  const response = await axios.put(`/story/publish/${id}`);
  return response.data;
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

export const fetchComments = async (storyId: number, page = 0, size = 10) => {
  const response = await axios.get(`/comments/story/${storyId}`, {
    params: { page, size }
  });
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