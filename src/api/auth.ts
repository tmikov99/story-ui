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

export const register = async (username: string, email: string, password: string) => {
  return await axios.post('/auth/register', { username, email, password});
}

export const refreshToken = async () => {
  const response = await axios.get('/auth/refresh');
  return response.data;
};

export const logout = async () => {
  return axios.post('/auth/logout');
};

export const forgotPassword = async (email: string): Promise<string> => {
  const response = await axios.post('/user/forgot-password', null, {
    params: { email },
  });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
  const response = await axios.post('/user/reset-password', {
    token,
    newPassword,
  });
  return response.data;
};