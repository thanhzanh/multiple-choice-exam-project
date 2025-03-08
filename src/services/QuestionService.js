import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/questions";

export const saveQuestion = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/create`, formData, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi tạo câu hỏi", error);
        throw error;
    }
}

