import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import {
  getUser,
  updateUser,
  changePassword,
} from "../../services/AccountService";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "information"; // Mặc định là 'information', 'change-password'

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [user, setUser] = useState(null);

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const getInfoUser = async () => {
      try {
        const infoUser = await getUser(); // Phản hồi từ gọi API

        setUser(infoUser);
      } catch (error) {
        console.error("Lỗi khi thấy thông tin người dùng:", error);
      }
    };
    getInfoUser();
  }, []);

  // Hàm thay đổi giá trị khi nhập thông tin
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === "dateOfBirth" ? moment(value).toISOString() : value,
    }));
  };

  // change value password
  const fChangePassword = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Hàm xử lý cập nhật
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const dataUpdate = {
        fullName: user.fullName,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: moment(user.dateOfBirth).toISOString(), // Chuyển thành ISO
      };

      const response = await updateUser(dataUpdate);

      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin", error);
    }
  };

  // Hàm xử lý thay đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://server-multiple-choice-exam-production.up.railway.app/api/v1/users/profile/change-password",
        passwords,
        { withCredentials: true }
      );

      if (response.data.code !== 200) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  return (
    <MainLayout>
      <h4>Cài đặt tài khoản</h4>

      <div className="mt-4 inner-profile">
        {/* Chuc nang */}
        <div className="inner-profile-function">
          <ul>
            <li onClick={() => setSearchParams({ tab: "information" })}>
              Thông tin tài khoản
            </li>
            <li onClick={() => setSearchParams({ tab: "change-password" })}>
              Đổi mật khẩu
            </li>
          </ul>
        </div>

        {/* Form */}
        <div className="inner-profile-form">
          {/* Hiển thị nội dung tab */}
          {tab === "information" && (
            <div className="mt-4">
              <p>Ảnh đại diện</p>
              <div className="inner_image">
                {user && (
                  <img
                    src={user.avatar.replace("s96-c", "s300-c")}
                    alt={user.fullName}
                    referrerPolicy="no-referrer"
                    roundedCircle
                    className="image-avatar"
                  />
                )}
              </div>

              <form method="PUT" onSubmit={handleUpdateProfile}>
                <div className="mb-3 form-group">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={user ? user.fullName : ""}
                    className="form-control"
                    style={{ width: "400px" }}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user ? user.email : ""}
                    className="form-control"
                    style={{ width: "400px" }}
                    readOnly
                  />
                </div>
                <div className="mb-3 form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={user ? user.phone : ""}
                    className="form-control"
                    style={{ width: "400px" }}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 form-group">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={
                      user?.dateOfBirth
                        ? moment(user.dateOfBirth).format("YYYY-MM-DD")
                        : ""
                    }
                    className="form-control"
                    style={{ width: "400px" }}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    name="gender"
                    className="form-control"
                    value={user ? user.gender : ""}
                    style={{ width: "400px" }}
                    onChange={handleChange}
                  >
                    <option selected>Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-50 mt-3">
                  Lưu
                </button>
              </form>
            </div>
          )}
          {tab === "change-password" && (
            <div className="mt-3">
              <form method="POST" onSubmit={handleChangePassword}>
                <div className="mb-3 form-group">
                  <label className="form-label">Mật khẩu hiện tại</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="current_password"
                      autoComplete="current-password"
                      className="form-control"
                      value={passwords.current_password}
                      style={{ width: "400px" }}
                      onChange={fChangePassword}
                    />
                    <FontAwesomeIcon
                      className="inner-eye-profile"
                      icon={showPassword.current ? faEyeSlash : faEye}
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    />
                  </div>
                </div>
                <div className="mb-3 form-group">
                  <label className="form-label">Mật khẩu mới</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="new_password"
                      autoComplete="new-password"
                      value={passwords.new_password}
                      className="form-control"
                      style={{ width: "400px" }}
                      onChange={fChangePassword}
                    />
                    <FontAwesomeIcon
                      className="inner-eye-profile"
                      icon={showPassword.new ? faEyeSlash : faEye}
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    />
                  </div>
                </div>
                <div className="mb-3 form-group">
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="password_confirmation"
                      autoComplete="new-password"
                      value={passwords.password_confirmation}
                      className="form-control"
                      style={{ width: "400px" }}
                      onChange={fChangePassword}
                    />
                    <FontAwesomeIcon
                      className="inner-eye-profile"
                      icon={showPassword.confirm ? faEyeSlash : faEye}
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-50 mt-3">
                  Lưu
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
