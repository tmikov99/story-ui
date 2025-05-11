import axios from "./axios";

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export const getCurrentUser = async () => {
  const response = await axios.get('/user');
  return response.data;
}

export const getUserByUsername = async (username: string) => {
  const response = await axios.get(`/user/${username}`);
  return response.data;
}

export const changePassword = async ({currentPassword, newPassword}: PasswordChangeRequest):Promise<string> => {
  const response = await axios.put('/user/password', {currentPassword, newPassword});
  return response.data;
}