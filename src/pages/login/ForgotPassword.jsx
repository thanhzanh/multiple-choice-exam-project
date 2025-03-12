import React, { useState } from "react";
import banner from "../../assets/banner.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/ForgotPasswordService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
        const response = await forgotPassword(email); // Gọi API  

        if (response.data.code !== 200) {
            toast.error(response.data.message || "Lỗi khi gửi email.");
            return;
        }

        toast.success("Đã gửi mã OTP qua email. Vui lòng kiểm tra hộp thư.");

        setTimeout(() => navigate("/auth/login"), 3000); 
    } catch (error) {
        toast.error("Lỗi gửi email.");
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
        <h4 className="text-left mb-4">Quên mật khẩu</h4>
        <p className="text-title-note">Vui lòng nhập email của bạn và kiểm tra hộp thư để lấy mật khẩu mới</p>
        <form method="POST" onSubmit={handleForgotPassword}>
          <div className="mb-3 form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Xác nhận
          </button>
          <p className="text-center text-muted mt-2">
            Bạn đã có tài khoản?
            <a
              className="text-primary register-link"
              onClick={() => navigate("/auth/login")}
            >
              Đăng nhập
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
