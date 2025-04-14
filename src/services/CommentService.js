import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/comments";

// Gửi bình luận
export const postComment = async (data) => {
    const res = await axios.post(`${API_URL}`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    
    return res;
};

// Lấy bình luận
export const getCommentsByExamId = async (examId) => {
    const res = await axios.get(`${API_URL}/exam/${examId}`, {
        withCredentials: true,
    });
    return res.data;
  };

