import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/exams";

// Gửi dữ liệu tạo đề thi lên server
export const createExam = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Response từ server:", res.data);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi tạo đề thi", error);
        throw error;
    }
};

// danh sách bài thi
export const listExams = async () => {
    try {
        const res = await axios.get(`${API_URL}/index`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài thi", error);
        throw error;
    }
}