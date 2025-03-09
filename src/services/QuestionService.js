import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/questions";

// tạo câu hỏi
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
};

// danh sách câu hỏi theo bài thi
export const getQuestionsByExam = async (examId) => {
    try {
        const res = await axios.get(`${API_URL}/getQuestionsByExam/${examId}`);
        
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách câu hỏi", error);
        throw error;
    }
};

// đếm câu hỏi theo bài thi
export const countQuestionByExam = async (examId) => {
    try {
        const res = await axios.get(`${API_URL}/countQuestion/${examId}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi đếm số lượng câu hỏi", error);
        throw error;
    }
};

