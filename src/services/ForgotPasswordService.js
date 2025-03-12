import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/users";

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/password/forgot`, 
            { email }, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        console.log("API phản hồi:", response);
        return response;
    } catch (error) {
        throw error;
    }
};