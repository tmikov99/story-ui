import axios from "./axios";

export const saveThumbnail = async (formData: FormData) => {
  const response = await axios.post(`/files/upload-thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
