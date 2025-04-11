import axios from "axios";

const API_URL = "https://server-multiple-choice-exam-production.up.railway.app/api/v1/results";

// Nộp bài ôn thi
export const submitExam = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/submit`, formData, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Data:", res);
        
        return res;
    } catch (error) {
        console.error("Lỗi khi nộp bài thi", error);
        throw error;
    }
};

