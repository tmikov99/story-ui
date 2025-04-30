import axios from "./axios";

export const getCurrentUser = async () => {
  const response = await axios.get('/user');
  return response.data;
}