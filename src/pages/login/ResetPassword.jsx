import React, { useState, useEffect } from "react";
import banner from "../../assets/reset_password.png";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/ForgotPasswordService";

const ResetPassword = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || ""; // Email gửi từ OTP sang
  const token = location.state?.token || ""; // Token gửi từ OTP sang  

  // check nếu người dùng truy cập thẳng trang /auth/otp thì quay lại
  useEffect(() => {
    if (!email || !token) {
      toast.error("Bạn chưa xác thực OTP. Vui lòng thực hiện lại.");
      navigate("/auth/otp-password");
    }
  }, [email, token, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: "",
    password_confirmation: ""
  });

  const handleChange = (e) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value })
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // check password xác nhận đúng không
    if (newPassword.password !== newPassword.password_confirmation) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      const response = await resetPassword(newPassword.password, token);      

      if (response.data.code !== 200) {
        toast.error(response.data.message || "Lỗi khi đặt lại mật khẩu");
        return;
      }

      toast.success("Đổi mật khẩu thành công");

      navigate("/auth/login"); 

    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đặt lại mật khẩu.");
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
        <p className="text-title-note">Vui lòng cập nhật mật khẩu của bạn.</p>
        <form method="POST" onSubmit={handleChangePassword}>
          <div className="mb-3 form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                readOnly
              />
            </div>
          <div className="mb-3 form-group inner-input">
            <label className="form-label">Mật khẩu mới</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={newPassword.password}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                className="inner-eye"
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="mb-3 form-group inner-input">
            <label className="form-label">Xác nhận mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password_confirmation"
                value={newPassword.password_confirmation}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                className="inner-eye"
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
