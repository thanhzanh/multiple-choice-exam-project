import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/exams";

// Gửi dữ liệu tạo đề thi lên server
export const createExam = async (formData) => {
    try {

        const res = await axios.post(`${API_URL}/create`, formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true
        });

        return res.data;
    } catch (error) {
        console.error("Lỗi khi tạo đề thi", error);
        throw error;
    }
};

// danh sách bài thi
export const listExams = async (keyword = "") => {
    try {
        const res = await axios.get(`${API_URL}/index`, {
            params: { keyword },
            withCredentials: true
        });
        
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
            withCredentials: true
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
        const res = await axios.get(`${API_URL}/detail/${examId}`, {
            withCredentials: true
        });        
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy bài thi", error);
        throw error;
    }
};

// xóa đề thi
export const deleteExam = async (examId) => {
    try {
        const res = await axios.delete(`${API_URL}/delete/${examId}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi xóa đề thi", error);
    }
};

// danh sách levels bài thi
export const getListEnumExam = async () => {
    const res = await axios.get(`${API_URL}/levels`);
    return res.data;
};

// tìm kiếm đề thi trên kênh đề thi
export const search = async (searchKeyword) => {
    const res = await axios.get(`${API_URL}/search?keyword=${searchKeyword}`);
    return res;
}

// lấy đề thi theo slug
export const getExamBySlug = async (slug) => {
    const res = await axios.get(`${API_URL}/${slug}`);

    console.log("Bai thi phan hoi: ", res.data);
    return res;
}

// Đếm số lượng truy cập bài thi
export const countViewsExam = async (slug) => {
    const res = await axios.get(`${API_URL}/${slug}`);
    return res;
}

// Tym/ bỏ tym bài thi yêu thích
export const favoriteExam = async (examId) => {
    const res = await axios.post(`${API_URL}/favorite/${examId}`, 
        { },
        { withCredentials: true }
    );
    return res;
};

export const listFavoriteExam = async (keyword = "") => {
    try {
        const res = await axios.get(`${API_URL}/favorite`, {
            params: {keyword}, // Thêm query vào URL
            withCredentials: true
        });

        return res.data.favoriteExams;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.response?.data || error.message);
        throw error;
    }
};
