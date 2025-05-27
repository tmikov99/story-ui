import { StoryItem } from '../types/page';
import axios from './axios';

export const createStoryItem = async (storyId: number | string, item: StoryItem): Promise<StoryItem> => {
    const response = await axios.post(`/story/${storyId}/items`, item);
    return response.data;
}

export const updateStoryItem = async (storyId: number | string, itemId: number | string, item: StoryItem): Promise<StoryItem> => {
    const response = await axios.put(`/story/${storyId}/items/${itemId}`, item);
    return response.data;
}

export const deleteStoryItem = async (storyId: number | string, itemId: number | string) => {
    const response = await axios.delete(`/story/${storyId}/items/${itemId}`);
    return response.data;
}

export const fetchStoryItems = async (storyId: number | string): Promise<StoryItem[]> => {
    const response = await axios.get(`/story/${storyId}/items`);
    return response.data;
}