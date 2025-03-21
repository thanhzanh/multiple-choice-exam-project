import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/users";

const HomeRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Gọi API để kiểm tra token có hợp lệ không
                await axios.get(`${API_URL}/getToken`, { withCredentials: true });

                // Nếu có token hợp lệ => Chuyển đến danh sách đề thi
                navigate('/workspace/exams/list');
            } catch (error) {
                console.error("Không có token hoặc token không hợp lệ:", error);

                // Nếu không có token => Chuyển đến trang login
                navigate('/auth/login');
            }
        };

        checkAuth();
    }, [navigate]);

    return null;
};

export default HomeRedirect;
