import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ auth }) => {
  const token = Cookies.get("token");
  const location = useLocation();
  const isResetPasswordPage = location.pathname === "/auth/reset-password";

  if (auth && !isResetPasswordPage) {
    // Nếu đã đăng nhập mà vào trang login/register → Chuyển hướng về dashboard
    return token ? <Navigate to="/workspace/exams/list" replace /> : <Outlet />;
  }

  // Nếu chưa đăng nhập mà vào trang cần bảo vệ → Chuyển hướng về login
  return token ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
