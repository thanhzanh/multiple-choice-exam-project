import React, { useState } from "react";
import banner from "../../assets/reset_password.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { otpPassword } from "../../services/ForgotPasswordService";

const OTPPassword = () => {
  const navigate = useNavigate();

  const location = useLocation(); 

  const email = location.state?.email || ""; // dùng để nhận email trang trước

  // check nếu người dùng truy cập thẳng trang /auth/forgot-password thì quay lại
  // useEffect(() => {
  //   if (!email) {
  //     toast.error("Vui lòng nhập địa chỉ email để xác nhận.");
  //     navigate("/auth/forgot-password");
  //   }
  // }, [email, navigate]);

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpPassword = async (event) => {
    event.preventDefault();

    try {
        const response = await otpPassword(email, otp); // Gọi API  

        if (response.data.code !== 200) {
            toast.error(response.data.message || "Lỗi khi gửi email.");
            return;
        }

        toast.success("OTP hợp lệ. Vui lòng đặt lại mật khẩu");

        // Lưu token backend trả về vào state để xác nhận lại mật khẩu
        navigate('/auth/reset-password', { state: { email, token: response.data.token } });
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message); 
      toast.error(error.response?.data?.message || "Xác thực OTP thất bại");
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
                type="email"
                className="form-control"
                name="email"
                value={email}
                readOnly
              />
            </div>
          <div className="mb-3 form-group">
            <label className="form-label">OTP</label>
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
