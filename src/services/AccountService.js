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
        const response = await axios.post(`${API_URL}/login`, // axios.post(url, data, config)
            JSON.stringify(userData),
            { 
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            
            });
        console.log(response);
        
        return response;
    } catch (error) {
        throw error;
    }
};

// Đăng xuất
export const logoutAccount = async () => {
    try {
        await axios.post(`${API_URL}/logout`, {},
            { withCredentials: true }
        );
        console.log("Đã đăng xuất");
    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
    }
};