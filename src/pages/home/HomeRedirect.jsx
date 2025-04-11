import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies for checking token existence

const API_URL = "https://server-multiple-choice-exam-production.up.railway.app/api/v1/users";

const HomeRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Trong HomeRedirect.jsx
const checkAuth = async () => {
    try {
      // Chỉ thử gọi API, không cần kiểm tra token trước
      const response = await axios.get(`${API_URL}/me`, {
        withCredentials: true,
      });
      
      if (response.data && response.data.success) {
        navigate("/workspace/exams/list");
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      // Lỗi 401 nghĩa là chưa đăng nhập
      navigate("/auth/login");
    }
  };
    
    checkAuth();
  }, [navigate]);
  
  return null;
};

export default HomeRedirect;