import React from "react";
import banner from "../assets/banner.png";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faG } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
  const navigate = useNavigate();
  
  const handleGoogleSuccess = (response) => {
    const { credential } = response;

    console.log("Google Token ID:", credential);
  };

  const handleGoogleFailure = () => {
    console.log("Login Failed");
  };
  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/api/v1/users/auth/google", "_self");
  };
  return (
    <div className="position-relative d-flex justify-content-center align-items-center vh-100">
      {/* Background Image */}
      <img
        src={banner}
        alt="banner"
        className="position-absolute w-100 h-100 object-fit-cover"
      />

      {/* Login Form */}
      <div
        className="login-container bg-white p-4 rounded shadow"
        style={{ width: "500px", zIndex: 10 }}
      >
        <h4 className="text-center mb-4">Đăng nhập</h4>

        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        <p className="text-center mb-2">hoặc tiếp tục với</p>
        <form action="">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
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
