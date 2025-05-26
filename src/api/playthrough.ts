import { PageData } from '../types/page';
import { Battle, PlaythroughData } from '../types/playthrough';
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

export const makePlaythroughChoice = async (playthroughId: number, choiceId: number) => {
    const response = await axios.post(`/playthrough/${playthroughId}/choice/${choiceId}`);
    return response.data;
}

export const performLuckCheck = async (playthroughId: number) => {
    const response = await axios.get(`/playthrough/${playthroughId}/testLuck`);
    return response.data;
}

export const sendStartBattle = async (playthroughId: number) => {
    const response = await axios.post(`/playthrough/${playthroughId}/battle/start`);
    return response.data;
}

export const doRollsInBattle = async (playthroughId: number): Promise<Battle> => {
    const response = await axios.post(`/playthrough/${playthroughId}/battle/play`);
    return response.data;
}

export const useLuckInBattle = async (playthroughId: number): Promise<Battle> => {
    const response = await axios.post(`/playthrough/${playthroughId}/battle/luck`);
    return response.data;
}

export const continueNextRound = async (playthroughId: number): Promise<Battle> => {
    const response = await axios.post(`/playthrough/${playthroughId}/battle/continue`);
    return response.data;
}

export const finishBattle = async (playthroughId: number): Promise<PlaythroughData> => {
    const response = await axios.post(`/playthrough/${playthroughId}/battle/finish`);
    return response.data;
}

export const fetchBattle = async (playthroughId: number): Promise<Battle> => {
    const response = await axios.get(`/playthrough/${playthroughId}/battle`);
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