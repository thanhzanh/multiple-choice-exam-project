import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/results";

// Nộp bài ôn thi
export const submitExam = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/submit`, formData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        console.log("Data:", res);
        
        return res;
    } catch (error) {
        console.error("Lỗi khi nộp bài thi", error);
        throw error;
    }
};

export const getResultExam = async (resultId) => {
    const res = await axios.get(`${API_URL}/${resultId}`, {
        withCredentials: true,
    });    
    return res;
};

