import { PageData } from "../types/page";
import axios from "./axios";

export const fetchPage = async (storyId: number, pageNumber: number) => {
    const response = await axios.get(`/page/${storyId}/page/${pageNumber}`);
    return response.data;
};

export const fetchPageById = async (pageId: number) => {
    const response = await axios.get(`/page/${pageId}`);
    return response.data;
}

export const fetchPagesByStory = async (storyId: number) => {
    const response = await axios.get(`/page/story/${storyId}`);
    return response.data;
}

export const fetchPagesMapByStory = async (storyId: number) => {
    const response = await axios.get(`/page/story/${storyId}/map`);
    return response.data;
}

export const createPage = async (pageData: PageData) => {
    const response = await axios.post('/page/create', pageData);
    return response.data;
}

export const updatePage = async (pageId:number, pageData: PageData) => {
    const response = await axios.put(`/page/${pageId}`, pageData);
    return response.data;
}