import axios from './axios';

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  imageUrl?: string;
}

export const login = async (username: string, password: string):Promise<AuthResponse> => {
  const response = await axios.post('/auth/login', { username, password });
  return response.data;
};

export const refreshToken = async () => {
  const response = await axios.get('/auth/refresh');
  return response.data;
};

export const logout = async () => {
  return axios.post('/auth/logout');
};