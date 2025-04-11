import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://server-multiple-choice-exam-production.up.railway.app/api/v1/users";

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/me`, {
          withCredentials: true, // rất quan trọng: để gửi cookie
        });

        // Nếu token hợp lệ và có thông tin user
        if (response.data && response.data.user) {
          console.log("Xác thực thành công:", response.data.user);
          navigate("/workspace/exams/list");
        } else {
          throw new Error("Không xác thực được người dùng");
        }
      } catch (error) {
        console.error("Không có token hoặc token không hợp lệ:", error);
        navigate("/auth/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return null;
};

export default HomeRedirect;
