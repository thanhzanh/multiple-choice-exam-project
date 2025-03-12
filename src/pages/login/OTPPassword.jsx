import React, { useState } from "react";
import banner from "../../assets/reset_password.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/ForgotPasswordService";

const OTPPassword = () => {
  const navigate = useNavigate();

  const location = useLocation(); 

  const email = location.state?.email || ""; // dùng để nhận email trang trước

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpPassword = async (event) => {
    event.preventDefault();

    try {
        const response = await forgotPassword(email, otp); // Gọi API  

        console.log(response);

        if (response.data.code !== 200) {
            toast.error(response.data.message || "Lỗi khi gửi email.");
            return;
        }

        toast.success("OP hợp lệ. Vui lòng đặt lại mật khẩu");

        navigate('/auth/reset-password', { state: { email } })
    } catch (error) {
        toast.error("Xác thực OTP thất bại");
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
        <p className="text-title-note">Vui lòng nhập OTP đã nhận từ email.</p>
        <form method="POST" onSubmit={handleOtpPassword}>
          <div className="mb-3 form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              name="otp"
              value={otp}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPassword;
