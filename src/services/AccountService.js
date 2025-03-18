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

// Lấy thông tin người dùng đăng nhập
export const getUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/getUser`,
            { withCredentials: true }
        );        
        
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Lấy thông tin người dùng đăng nhập
export const updateUser = async (dataUpdate) => {
    try {
        const response = await axios.put(`${API_URL}/profile/info`, dataUpdate,
            { withCredentials: true }
        );        
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Thay đổi mật khẩu
export const changePassword = async (dataChange) => {
    try {
        const response = await axios.post(`${API_URL}/profile/change-password`, 
            dataChange,
            { 
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );               
        return response;
    } catch (error) {
        throw error;
    }
};