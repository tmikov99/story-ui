import axios from "./axios";

export const fetchPage = async (id: number) => {
    const response = await axios.get(`/page/${id}`);
    return response.data;
};