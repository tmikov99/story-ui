import axios from "./axios";

export const saveUserPicture = async (formData: FormData) => {
  const response = await axios.post("/user/picture", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
