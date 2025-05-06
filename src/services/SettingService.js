import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/settings";

// Lấy thông tin cài đặt
export const getSettings = async () => {
    const res = await axios.get(`${API_URL}`, {
        withCredentials: true,
    });
    
    return res.data;
};

// Cập nhật cài đặt
export const updateSettings = async (data) => {
    const res = await axios.put(`${API_URL}`, data, {
        withCredentials: true,
    });
    return res.data;
  };

