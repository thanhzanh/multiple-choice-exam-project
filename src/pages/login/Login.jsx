import React, { useState } from "react";
import banner from "../../assets/banner.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Giải mã token Google
import { useNavigate, Navigate } from "react-router-dom";
import { loginAccount } from "../../services/AccountService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const tokenUser = Cookies.get("token");
  if (tokenUser) {
    return <Navigate to="/workspace/exams/list" replace />;
  }

  // Xử lý đăng nhập bằng Google
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    // const userInfo = jwtDecode(token); // Giải mã để xem thông tin user

    try {
      // Cách 1 dùng fetch
      // const response = await fetch("http://localhost:3000/api/v1/users/auth/google", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ token })
      // });

      // Cách 2 dùng axios
      const response = await axios.post(
        "https://server-multiple-choice-exam-production.up.railway.app/api/v1/users/auth/google",
        { token },
        { withCredentials: true } // Dùng để gửi và nhận cookie
      );

      const data = response.data;

      if (data.success) {
        toast.success("Đăng nhập thành công");

        navigate("/workspace/exams/list", { replace: true });
      } else {
        toast.error("Đăng nhập Google thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google", error);
      toast.error("Đã xãy ra lỗi");
    }
  };

  // Xử lý đăng nhập bằng email & password
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  // xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn form reload lại trang

    try {
      const userData = {
        email: login.email,
        password: login.password,
      };

      // Gọi API đăng nhập
      const response = await loginAccount(userData);

      console.log("Phản hồi đăng nhập:", response.data);

      if (response.data.code !== 200) {
        toast.error(response.data.message);
        return;
      }

      toast.success("Đăng nhập thành công");

      navigate("/workspace/exams/list");
    } catch (error) {
      if (error.response && error.response.data) {
        const { err, message } = error.response.data;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [err]: message,
        }));
        toast.error(message);
      }
    }
  };

  return (
    <div className="position-relative d-flex justify-content-center align-items-center vh-100">
      <img
        src={banner}
        alt="banner"
        className="position-absolute w-100 h-100 object-fit-cover"
      />

      <div
        className="login-container bg-white p-4 rounded shadow"
        style={{ width: "500px", zIndex: 10 }}
      >
        <h4 className="text-center mb-4">Đăng nhập</h4>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");
              toast.error("Đăng nhập Google thất bại");
            }}
          />
        </GoogleOAuthProvider>

        <p className="text-center mt-3 mb-3 or-divider">hoặc tiếp tục với</p>
        <form method="POST" onSubmit={handleLogin}>
          <div className="mb-3 form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={login.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 form-group inner-input">
            <label className="form-label">Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={login.password}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                className="inner-eye"
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <p
              onClick={() => navigate("/auth/forgot-password")}
              className="text-decoration-none text-primary"
              style={{ cursor: "pointer" }}
            >
              Quên mật khẩu?
            </p>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng nhập
          </button>
          <p className="text-center text-muted mt-2">
            Bạn chưa có tài khoản?
            <a
              className="text-primary register-link"
              onClick={() => navigate("/auth/register")}
            >
              Đăng ký
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
