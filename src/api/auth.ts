import axios from './axios';

export const login = async (username: string, password: string) => {
  const response = await axios.post('/auth/login', { username, password });
  const accessToken = response.data.token;
  sessionStorage.setItem('accessToken', accessToken);
  return response.data;
};

export const refreshToken = async () => {
  const response = await axios.get('/auth/refresh');
  return response.data;
};

export const logout = async () => {
  return axios.post('/auth/logout');
};