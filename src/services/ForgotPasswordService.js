import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/users";

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/password/forgot`, 
            { email }, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const otpPassword = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/password/otp`,
            { email, otp },
            { withCredentials: true,
                headers: { "Content-Type": "application/json" }
             }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (password, token) => {
    try {
        const response = await axios.post(`${API_URL}/password/reset`,
            { password, token },
            { withCredentials: true,
                headers: { "Content-Type": "application/json" }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}