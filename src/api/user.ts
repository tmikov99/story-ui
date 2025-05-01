import axios from "./axios";

export const getCurrentUser = async () => {
  const response = await axios.get('/user');
  return response.data;
}

export const getUserByUsername = async (username: string) => {
  const response = await axios.get(`/user/${username}`);
  return response.data;
}