import React, { useState } from "react";
import banner from "../assets/banner.png";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { loginAccount } from "../services/AccountService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faG } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";


const Login = () => {
  const navigate = useNavigate();
  
  const handleGoogleSuccess = () => {
    window.open("http://localhost:3000/api/v1/users/auth/google", "_self");
  };

  const handleGoogleFailure = () => {
    console.log("Login Failed");
  };
  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/api/v1/users/auth/google", "_self");
  };

  // login email & password
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  // xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();  // Ngăn form reload lại trang

    try {
      const userData = {
        email: login.email,
        password: login.password
      }
      
      // Gọi API đăng nhập
      const response = await loginAccount(userData);

      if (response.data.code !== 200) {
        toast.error(response.data.message)
        return;
      }

      toast.success("Đăng nhập thành công");

      navigate("/workspace/exams/list");

    } catch (error) {
      if (error.response && error.response.data) {
        const { err, message } = error.response.data;
        setErrors((prevErrors) => ({
            ...prevErrors,
            [err]: message
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

        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        <p className="text-center mb-2">hoặc tiếp tục với</p>
        <form method="POST" onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={login.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={login.password}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-between">
            <a href="#" className="text-decoration-none">
              Quên mật khẩu?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng nhập
          </button>
          <p className="text-center text-muted">
              Bạn chưa có tài khoản?   
              <a className="text-primary" onClick={() => navigate('/auth/register')}>Đăng ký</a>
            </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
