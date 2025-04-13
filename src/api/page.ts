import axios from "./axios";

export const fetchPage = async (storyId: number, pageNumber: number) => {
    const response = await axios.get(`/page/${storyId}/page/${pageNumber}`);
    return response.data;
};