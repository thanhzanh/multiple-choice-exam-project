import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://server-multiple-choice-exam-production.up.railway.app/api/v1/users";

const HomeRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const tokenUser = Cookies.get("token");

            // try {
            //     // Gọi API để kiểm tra token có hợp lệ không
            //     // const response = await axios.get(`${API_URL}/getUser`, { withCredentials: true });
            //     const tokenUser = Cookies.get("token");

            //     // Nếu có token hợp lệ => Chuyển đến danh sách đề thi
            //     if (tokenUser) {
            //         console.log("Xác thực thành công:", tokenUser);
            //         navigate("/workspace/exams/list");
            //     } else {
            //         throw new Error("Không xác thực được người dùng");
            //     }
            // } catch (error) {
            //     console.error("Không có token hoặc token không hợp lệ:", error);

            //     // Nếu không có token => Chuyển đến trang login
            //     navigate('/auth/login');
            // }
            if (tokenUser) {
                console.log("Xác thực thành công:", tokenUser);
                navigate("/workspace/exams/list");
            }
        };

        checkAuth();
    }, [navigate]);

    return null;
};

export default HomeRedirect;
