import React, { useState } from "react";
import banner from "../assets/banner.png";
import { createAccount } from "../services/AccountService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Register = () => {
    const navigate = useNavigate();
    const [register, setRegister] = useState({
        fullName: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setRegister({...register, [e.target.name] : e.target.value});
    }

    const handleCreateAccount = async (e) => {
        e.preventDefault();  // Ngăn form reload lại trang
    
        try {
            const userData = {
                fullName: register.fullName,
                email: register.email,
                password: register.password,
                password_confirmation: register.password_confirmation // Bổ sung
            };

            const response = await createAccount(userData);
    
            // Kiểm tra nếu response là lỗi thì không chuyển hướng
            if (response.data.code !== 200) {
                toast.error(response.data.message);
                return;
            }

            toast.success("Đăng ký thành công");

            navigate("/auth/login");
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
            className="login-container bg-white p-4 rounded shadow" style={{ width: "500px", zIndex: 10 }}>
            <h4 className="text-center">Đăng ký tài khoản</h4>

            <form onSubmit={handleCreateAccount} method="POST">
                <div className="mb-3 form-group">
                    <label className="form-label">Họ tên</label>
                    <input
                    type="text"
                    name="fullName"
                    value={register.fullName}
                    onChange={handleChange}
                    className="form-control"
                    />
                </div>
            <div className="mb-3 form-group">
                <label className="form-label">Email</label>
                <input
                type="email"
                name="email"
                value={register.email}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            <div className="mb-3 form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                type="password"
                name="password"
                value={register.password}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            <div className="mb-3 form-group">
                <label className="form-label">Xác nhận mật khẩu</label>
                <input
                type="password"
                name="password_confirmation"
                value={register.password_confirmation}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
                Đăng ký
            </button>
            <p className="text-center text-muted">
                Already have an account? <a className="text-primary" onClick={() => navigate('/auth/login')}>Đăng nhập</a>
            </p>
            </form> 
        </div>
    </div>
  );
};

export default Register;
