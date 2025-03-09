import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/exams";

// Gửi dữ liệu tạo đề thi lên server
export const createExam = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
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

// Gửi dữ liệu chỉnh sửa đề thi lên server
export const editExam = async (examId, formData) => {
    try {
        const res = await axios.patch(`${API_URL}/edit/${examId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi khi chỉnh sửa đề thi", error);
        throw error;
    }
};

// lấy bài thi theo examId
export const getExamById  = async (examId) => {
    try {
        const res = await axios.get(`${API_URL}/detail/${examId}`);        
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy bài thi", error);
        throw error;
    }
};

// xóa đề thi
export const deleteExam = async (examId) => {
    try {
        await axios.delete(`${API_URL}/detail/${examId}`);
    } catch (error) {
        console.error("Lỗi khi xóa đề thi", error);
    }
};