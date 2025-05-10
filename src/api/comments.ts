import { PaginatedResponse, StoryCommentData } from "../types/story";
import axios from "./axios";

type FetchParams = {
  query?: string;
  page?: number;
  size?: number;
  sortField?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export const fetchUserComments = async (
  params?: FetchParams
): Promise<PaginatedResponse<StoryCommentData>> => {
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

  const response = await axios.get<PaginatedResponse<StoryCommentData>>('/comments/mine', {
    params: requestParams,
  });

  return response.data;
};

export const deleteComment = async (sommentId: number) => {
  const response = await axios.delete(`/comments/${sommentId}`);
  return response.data;
}