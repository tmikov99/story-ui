import { PageData } from '../types/page';
import { PlaythroughData } from '../types/playthrough';
import { PaginatedResponse } from '../types/story';
import axios from './axios';

export const fetchPlaythrough = async (id: number) => {
    const response = await axios.get(`/playthrough/${id}`);
    return response.data;
};

export const fetchPlaythroughs = async (storyId: number):Promise<PlaythroughData[]> => {
    const response = await axios.get(`/playthrough/story/${storyId}`);
    return response.data;
}

export const startPlaythrough = async (id: number) => {
    const response = await axios.post(`/playthrough/start/${id}`);
    return response.data;
};

export const chooseNextPage = async (playthroughId: number, pageNumber: number): Promise<PageData> => {
    const response = await axios.patch(`/playthrough/${playthroughId}/choose/${pageNumber}`);
    return response.data;
}

export const fetchUserPlaythroughs = async (
  page = 0,
  size = 10,
  query?: string,
  sortField = 'lastVisited',
  sortOrder = 'desc'
): Promise<PaginatedResponse<PlaythroughData>> => {
  const response = await axios.get(`/playthrough`, {
    params: {
        page,
        size,
        sort: `${sortField},${sortOrder}`,
        ...(query ? { q: query } : {})
    }
  });
  return response.data;
};

export const fetchPlaythroughCurrentPage = async (id: number): Promise<PageData> => {
    const response = await axios.get(`/playthrough/${id}/currentPage`);
    return response.data;
}

export const loadPlaythrough = async (id: number) => {
    const response = await axios.post(`/playthrough/${id}/load`);
    return response.data;
}

export const deletePlaythrough = async (id: number) => {
    const response = await axios.delete(`/playthrough/${id}`);
    return response.data;
}