import React, { useState } from "react";
import banner from "../../assets/banner.png";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { loginAccount } from "../../services/AccountService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();

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
        <p className="text-center mt-3 mb-3 or-divider">hoặc tiếp tục với</p>
        <form method="POST" onSubmit={handleLogin}>
          <div className="mb-3 form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
            />
          </div>
          <div className="mb-3 form-group inner-input">
            <label className="form-label">Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type="password"
                className="form-control"
                name="password"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
