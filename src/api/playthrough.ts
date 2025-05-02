import axios from './axios';

export const fetchPlaythrough = async (id: number) => {
    const response = await axios.get(`/playthrough/${id}`);
    return response.data;
};

export const startPlaythrough = async (id: number) => {
    const response = await axios.post(`/playthrough/${id}/start`);
    return response.data;
};

export const updatePlaythrough = async (storyId: number, pageNumber: number) => {
    const response = await axios.put(`/playthrough/${storyId}/choose/${pageNumber}`);
    return response.data;
}

export const fetchUserPlaythroughs = async () => {
    const response = await axios.get(`/playthrough`);
    return response.data;
};