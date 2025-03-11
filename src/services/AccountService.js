import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/users";

// Đăng ký tài khoản
export const createAccount = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`,
            JSON.stringify(userData),
            {
            headers: { "Content-Type": "application/json" },
        });
        
        return response;
    } catch (error) {
        throw error;
    }
};

// Đăng nhập tài khoản
export const loginAccount = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`,
            JSON.stringify(userData),
            {
            headers: { "Content-Type": "application/json" },
        });
        console.log(response);
        
        return response;
    } catch (error) {
        throw error;
    }
};